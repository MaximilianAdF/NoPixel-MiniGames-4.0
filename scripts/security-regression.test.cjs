// Isolated handler/engine regressions: no database or external service calls.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { NextRequest, NextResponse } = require('next/server');
const { ObjectId } = require('mongodb');

function load(file, mocks = {}, cache = new Map()) {
  const absolute = path.resolve(file);
  if (cache.has(absolute)) return cache.get(absolute).exports;
  const module = { exports: {} }; cache.set(absolute, module);
  const source = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const localRequire = name => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (name.startsWith('@/') || name.startsWith('.')) {
      const target = name.startsWith('@/') ? path.resolve(name.slice(2)) : path.resolve(path.dirname(absolute), name);
      return load(target.endsWith('.ts') ? target : `${target}.ts`, mocks, cache);
    }
    return require(name);
  };
  new Function('require', 'module', 'exports', source)(localRequire, module, module.exports);
  return module.exports;
}

// Evaluate the small set of Mongo expressions used in the atomic reward update.
function evaluate(value, doc) {
  if (typeof value === 'string' && value.startsWith('$')) return doc[value.slice(1)];
  if (value === null || typeof value !== 'object' || value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(v => evaluate(v, doc));
  const [op, raw] = Object.entries(value)[0];
  const args = evaluate(raw, doc);
  switch (op) {
    case '$ifNull': return args[0] ?? args[1];
    case '$add': return args.reduce((a, b) => a + b, 0);
    case '$divide': return args[0] / args[1];
    case '$pow': return Math.pow(...args);
    case '$floor': return Math.floor(args);
    case '$round': return Number(args[0].toFixed(args[1]));
    case '$eq': return args[0] === args[1];
    case '$cond': return args[0] ? args[1] : args[2];
    case '$max': return Math.max(...args);
    default: throw Error(`Unsupported Mongo expression ${op}`);
  }
}

const userId = '507f1f77bcf86cd799439011';
const challengeId = '507f1f77bcf86cd799439012';
const session = { user: { id: userId } };
function common(client, auth = session) {
  return {
    '@/lib/auth/session': { getSession: async () => auth, clearSession: async () => {} },
    '@/lib/mongodb': { default: Promise.resolve(client) },
    '@/lib/rateLimit': { rateLimit: async () => null, checkRateLimit: () => ({ success: true }) },
  };
}
function challengeFixture(overrides = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(); yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const challenge = { date: today, game: 'chopping', numLetters: 15, targetScore: 15, targetTime: 7000, ...overrides };
  let user = { _id: new ObjectId(userId), totalXP: 1200, level: 4, currentDailyStreak: 5,
    longestDailyStreak: 10, lastDailyChallengeDate: yesterday.toISOString().slice(0, 10) };
  const progress = { attempts: 0, completed: false, bestAttempt: { score: 0 } };
  let progressWrites = 0;
  const client = { db: () => ({ collection: name => name === 'dailyChallenges' ? {
    findOne: async () => challenge,
  } : name === 'users' ? {
    findOneAndUpdate: async (filter, pipeline, options) => {
      assert.equal(options.returnDocument, 'before');
      assert.equal(filter.lastDailyChallengeDate.$ne, today);
      if (user.lastDailyChallengeDate === today) return null;
      const before = { ...user };
      for (const stage of pipeline) {
        const changes = Object.fromEntries(Object.entries(stage.$set).map(([key, value]) => [key, evaluate(value, user)]));
        user = { ...user, ...changes };
      }
      return before;
    },
  } : {
    findOneAndUpdate: async (_filter, update) => {
      progressWrites++; progress.attempts++; Object.assign(progress, update.$set);
      progress.bestAttempt.score = Math.max(progress.bestAttempt.score, update.$max['bestAttempt.score']);
      return structuredClone(progress);
    },
    updateOne: async (_filter, update) => { Object.assign(progress, update.$set); },
  } }) };
  const route = load('app/api/challenges/complete/route.ts', common(client));
  const submit = values => route.POST({ json: async () => ({ challengeId, score: 15, timeMs: 5000, mistakes: 0, won: true, ...values }) });
  return { submit, user: () => user, progress, writes: () => progressWrites };
}

test('security and account regressions', async t => {
  Object.assign(process.env, { NEXTAUTH_SECRET: 'test-only-session-secret-at-least-32-bytes',
    NEXTAUTH_URL: 'http://localhost:3000', DISCORD_REDIRECT_URI: 'http://localhost:3000/api/auth/discord/callback',
    DISCORD_CLIENT_ID: '123456789', DISCORD_CLIENT_SECRET: 'test-secret', ADMIN_DISCORD_IDS: 'admin-123', ABLY_API_KEY: 'test.key:secret' });
  const jose = await import('jose');

  await t.test('only allowlisted Discord admins can reset challenges', async () => {
    let deletes = 0;
    const client = { db: () => ({ collection: () => ({ deleteOne: async () => { deletes++; return { deletedCount: 1 }; } }) }) };
    for (const [auth, expected] of [[null, 401], [session, 403], [{ user: { id: userId, discordId: 'other' } }, 403], [{ user: { id: userId, discordId: 'admin-123' } }, 200]]) {
      const r = load('app/api/challenges/reset-today/route.ts', common(client, auth));
      assert.equal((await r.DELETE()).status, expected);
    }
    assert.equal(deletes, 1);
  });

  await t.test('account deletion accepts the MongoDB v6 document return', async () => {
    let cleared = false; const deleted = []; let ended = false;
    const client = { db: () => ({ collection: name => ({
      findOneAndDelete: async () => ({ _id: new ObjectId(userId) }),
      deleteMany: async () => { deleted.push(name); },
    }) }), startSession: () => ({ withTransaction: async fn => fn(), endSession: async () => { ended = true; } }) };
    const mocks = common(client); mocks['@/lib/auth/session'].clearSession = async () => { cleared = true; };
    const response = await load('app/api/user/delete/route.ts', mocks).DELETE();
    assert.equal(response.status, 200); assert.ok(cleared && ended);
    assert.deepEqual(deleted, ['userChallengeProgress', 'analyticsEvents']);
  });

  await t.test('concurrent completions award once and preserve streak/level at a cube boundary', async () => {
    const f = challengeFixture();
    const responses = await Promise.all(Array.from({ length: 12 }, () => f.submit()));
    const data = await Promise.all(responses.map(r => r.json()));
    assert.equal(data.reduce((n, r) => n + r.xpEarned, 0), 400);
    assert.equal(data.filter(r => r.streakUpdated).length, 1);
    assert.equal(f.user().totalXP, 1600); assert.equal(f.user().level, 5);
    assert.equal(f.user().currentDailyStreak, 6); assert.equal(f.user().longestDailyStreak, 10);
    assert.equal((await (await f.submit()).json()).xpEarned, 0);
    assert.equal((await (await f.submit({ won: false, score: 0 })).json()).completed, true);
  });

  await t.test('old/future challenges cannot write progress, XP, or streak', async () => {
    for (const date of ['2020-01-01', '2099-01-01']) {
      const f = challengeFixture({ date });
      assert.equal((await f.submit()).status, 409); assert.equal(f.writes(), 0);
      assert.equal(f.user().totalXP, 1200);
    }
  });

  await t.test('a failed final ring is not a completed challenge', async () => {
    const { lockpickEngine } = load('app/components/lockpickEngine.ts');
    const state = { level: 3, failedUnlock: false, rings: Array.from({ length: 4 }, () => ({
      color: ['red', 'blue'], balls: [0], slots: [1], rotation: 1,
    })) };
    const result = lockpickEngine.applyInput(state, { type: 'unlock' });
    assert.equal(result.outcome, 'lost'); assert.equal(lockpickEngine.getScore(result.state), 3);
    for (const game of ['lockpick', 'laundromat']) {
      const f = challengeFixture({ game, levels: 4 });
      const data = await (await f.submit({ score: 3, won: false })).json();
      assert.equal(data.completed, false); assert.equal(data.xpEarned, 0);
      assert.equal((await (await f.submit({ score: 3, won: true })).json()).completed, true);
    }
    assert.equal((await challengeFixture().submit({ won: undefined })).status, 400);
  });

  await t.test('OAuth state is unpredictable and return paths cannot escape the site', async () => {
    const config = load('lib/auth/config.ts');
    for (const bad of ['//evil.invalid', '/\\evil.invalid', 'https://evil.invalid', '/\nLocation: evil']) assert.equal(config.safeReturnTo(bad), '/');
    assert.equal(config.safeReturnTo('/puzzles/chopping?challengeId=123'), '/puzzles/chopping?challengeId=123');
    const route = load('app/api/auth/discord/login/route.ts');
    const request = new NextRequest('http://localhost:3000/api/auth/discord/login?returnTo=%2Fprofile');
    const a = await route.GET(request), b = await route.GET(request);
    const state = new URL(a.headers.get('location')).searchParams.get('state');
    assert.equal(state.length, 64); assert.notEqual(state, new URL(b.headers.get('location')).searchParams.get('state'));
    assert.equal(a.cookies.get('discord_oauth_state').value, state);
    assert.equal(a.cookies.get('auth_return_to').value, '/profile');
    assert.equal(new URL(a.headers.get('location')).searchParams.get('redirect_uri'), process.env.DISCORD_REDIRECT_URI);
  });

  await t.test('callback rejects missing/mismatched state before exchanging any code', async () => {
    let exchanges = 0; const removed = [];
    const mocks = { ...common({}), 'next/headers': { cookies: () => ({ delete: n => removed.push(n) }) },
      '@/lib/auth/discord': { exchangeCodeForToken: async () => { exchanges++; } } };
    const route = load('app/api/auth/discord/callback/route.ts', mocks);
    const r = await route.GET(new NextRequest('http://localhost:3000/api/auth/discord/callback?code=attack&state=wrong'));
    assert.ok(r.headers.get('location').includes('invalid_state')); assert.equal(exchanges, 0);
    assert.ok(removed.includes('discord_oauth_state'));
  });

  await t.test('valid Discord callback signs fresh account data and a full site session', async () => {
    let user = { _id: new ObjectId(userId), discordId: 'discord-123', username: 'old-name', avatar: 'old', level: 4, totalXP: 1200 };
    let payload;
    const client = { db: () => ({ collection: () => ({
      findOne: async () => ({ ...user }), updateOne: async (_f, update) => { Object.assign(user, update.$set); },
    }) }) };
    const mocks = { ...common(client, null), 'next/headers': { cookies: () => ({ delete: () => {} }) },
      '@/lib/auth/discord': {
        exchangeCodeForToken: async () => ({ access_token: 'test-access', refresh_token: 'test-refresh', expires_in: 60 }),
        getDiscordUser: async () => ({ id: 'discord-123', username: 'new-name', avatar: 'new-avatar' }),
        getDiscordAvatarUrl: () => 'https://cdn.discordapp.com/new-avatar.png',
      },
    };
    mocks['@/lib/auth/session'].createSessionToken = async p => { payload = p; return 'signed'; };
    const state = 'a'.repeat(64);
    const request = new NextRequest(`http://localhost:3000/api/auth/discord/callback?code=valid&state=${state}`, {
      headers: { cookie: `discord_oauth_state=${state}; auth_return_to=%2Fprofile` },
    });
    const r = await load('app/api/auth/discord/callback/route.ts', mocks).GET(request);
    assert.equal(r.headers.get('location'), 'http://localhost:3000/profile');
    assert.equal(payload.user.username, 'new-name'); assert.equal(payload.user.avatar, 'https://cdn.discordapp.com/new-avatar.png');
    assert.ok(payload.expiresAt > Date.now() + 6 * 86400000);
    assert.equal(r.cookies.get('nopixel_session').value, 'signed'); assert.equal(user.isGuest, false);
  });

  await t.test('linking a guest to Discord preserves progress and clears guest flags', async () => {
    let user = { _id: new ObjectId(userId), username: 'Guest', isGuest: true, guestDeviceId: 'device', level: 4, totalXP: 1200 };
    let payload;
    const client = { db: () => ({ collection: () => ({
      findOne: async filter => typeof filter.discordId === 'string' && user.discordId !== filter.discordId ? null : { ...user },
      updateOne: async (_f, update) => {
        Object.assign(user, update.$set);
        for (const key of Object.keys(update.$unset || {})) delete user[key];
      },
    }) }) };
    const mocks = { ...common(client), 'next/headers': { cookies: () => ({ delete: () => {} }) },
      '@/lib/auth/discord': {
        exchangeCodeForToken: async () => ({ access_token: 'test', refresh_token: 'test', expires_in: 60 }),
        getDiscordUser: async () => ({ id: 'discord-linked', username: 'Linked', avatar: null }),
        getDiscordAvatarUrl: () => 'https://cdn.discordapp.com/default.png',
      },
    };
    mocks['@/lib/auth/session'].createSessionToken = async p => { payload = p; return 'signed'; };
    const state = 'b'.repeat(64);
    const request = new NextRequest(`http://localhost:3000/api/auth/discord/callback?code=valid&state=${state}`, {
      headers: { cookie: `discord_oauth_state=${state}` },
    });
    const r = await load('app/api/auth/discord/callback/route.ts', mocks).GET(request);
    assert.equal(r.cookies.get('nopixel_session').value, 'signed');
    assert.equal(payload.user.id, userId); assert.equal(payload.user.xp, 1200);
    assert.equal(user.isGuest, false); assert.equal(user.verified, true); assert.ok(!user.guestDeviceId);
  });

  await t.test('session tokens cannot be substituted with signed lobby identities', async () => {
    const auth = load('lib/auth/session.ts', { jose, 'next/headers': { cookies: () => ({}) } });
    const payload = { ...session, accessToken: 'guest', refreshToken: 'guest', expiresAt: Date.now() + 86400000 };
    const token = await auth.createSessionToken(payload);
    assert.equal((await auth.verifySessionToken(token)).user.id, userId);
    const guest = await new jose.SignJWT({}).setProtectedHeader({ alg: 'HS256' })
      .setSubject('guest-test').setAudience('lobby-guest').setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET));
    assert.equal(await auth.verifySessionToken(guest), null);
  });

  await t.test('Ably tokens are channel-scoped and guest identities cannot be chosen or forged', async () => {
    const requests = [];
    const mocks = { ...common({}, null), jose, ably: { Rest: class {
      auth = { createTokenRequest: async args => { requests.push(args); return args; } };
    } } };
    const route = load('app/api/ably/token/route.ts', mocks);
    const url = 'http://localhost:3000/api/ably/token?channel=lobby:ABCDEF&clientId=guest-impersonated';
    const first = await route.GET(new NextRequest(url)); const a = await first.json();
    assert.deepEqual(Object.keys(a.capability), ['lobby:ABCDEF']); assert.notEqual(a.clientId, 'guest-impersonated');
    const cookie = first.cookies.get('nphacks_lobby_guest').value;
    const second = await route.GET(new NextRequest(url, { headers: { cookie: `nphacks_lobby_guest=${cookie}` } }));
    assert.equal((await second.json()).clientId, a.clientId);
    const forged = await route.GET(new NextRequest(url, { headers: { cookie: 'nphacks_lobby_guest=guest-impersonated' } }));
    assert.notEqual((await forged.json()).clientId, 'guest-impersonated');
    assert.equal(first.headers.get('cache-control'), 'private, no-store');
    assert.equal((await route.GET(new NextRequest('http://localhost:3000/api/ably/token?channel=lobby:*'))).status, 400);
  });

  await t.test('only admitted players send messages and only the host controls matches', async () => {
    const { isAuthorizedLobbyMessage: accept, isLobbyGameInput } = load('lib/lobby/messageValidation.ts');
    const members = [{ clientId: 'host', timestamp: 1 }, { clientId: 'peer', timestamp: 2 }, { clientId: 'outsider', timestamp: 3 }];
    const start = { type: 'match:start', game: 'chopping', seed: 42, focusMode: false, startedAt: Date.now(), goAt: Date.now() + 3000 };
    assert.ok(accept(start, 'host', members, 'peer')); assert.ok(!accept(start, 'peer', members, 'host'));
    assert.ok(!accept(start, 'outsider', members, 'peer'));
    const outcome = { type: 'match:outcome', winnerClientId: 'host', reason: 'finished' };
    assert.ok(!accept(outcome, 'peer', members, 'host')); assert.ok(accept(outcome, 'host', members, 'peer'));
    assert.ok(!accept({ type: 'emote', emote: 'wave', fromClientId: 'host' }, 'peer', members, 'host'));
    assert.ok(!accept(null, 'host', members, 'peer'));
    assert.ok(!isLobbyGameInput('chopping', null)); assert.ok(isLobbyGameInput('chopping', 'Q'));
    assert.ok(!isLobbyGameInput('thermite', { type: 'click', coord: null }));
    assert.ok(isLobbyGameInput('thermite', { type: 'click', coord: [0, 0], timestamp: 1 }));
  });
});
