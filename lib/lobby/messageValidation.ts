import type { LobbyMessage } from './messages';
import { determineHost } from './host';
import { isGameType, isSaneNumber } from '@/lib/gameValidation';

type Member = { clientId: string; timestamp: number };

export function lobbyPlayers<T extends Member>(members: T[]): T[] {
  return [...members].sort((a, b) => a.timestamp - b.timestamp || a.clientId.localeCompare(b.clientId)).slice(0, 2);
}

/** Trust Ably's authenticated sender, never identity fields supplied in the payload. */
export function isAuthorizedLobbyMessage(
  value: unknown, senderId: string | undefined, members: Member[], selfId: string | null,
): value is LobbyMessage {
  const players = lobbyPlayers(members);
  if (!senderId || senderId === selfId || !players.some(p => p.clientId === senderId) ||
      !players.some(p => p.clientId === selfId) || !value || typeof value !== 'object') return false;
  const msg = value as Record<string, unknown>;
  const isHost = senderId === determineHost(players);
  switch (msg.type) {
    case 'match:start':
      return players.length === 2 && isHost && isGameType(msg.game) && msg.game !== 'repair-kit' &&
        isSaneNumber(msg.seed, Number.MAX_SAFE_INTEGER) && typeof msg.focusMode === 'boolean' &&
        isSaneNumber(msg.goAt, Number.MAX_SAFE_INTEGER) && isSaneNumber(msg.startedAt, Number.MAX_SAFE_INTEGER);
    case 'match:result':
      return typeof msg.won === 'boolean' && isSaneNumber(msg.score) && isSaneNumber(msg.elapsedMs, 180_000);
    case 'match:input':
      return msg.input !== undefined && JSON.stringify(msg.input).length <= 4096;
    case 'match:timeout': return true;
    case 'match:outcome':
      return isHost && (msg.reason === 'finished' || msg.reason === 'timeout') &&
        (msg.winnerClientId === null || players.some(p => p.clientId === msg.winnerClientId));
    case 'emote':
      return msg.fromClientId === senderId && typeof msg.emote === 'string' && msg.emote.length < 80;
    default: return false;
  }
}

export function isLobbyGameInput(game: string, value: unknown): boolean {
  if (game === 'chopping') return typeof value === 'string' && /^[qwerasd]$/i.test(value);
  if (!value || typeof value !== 'object') return false;
  const input = value as Record<string, unknown>;
  switch (game) {
    case 'thermite':
      return input.type === 'click' && Array.isArray(input.coord) && input.coord.length === 2 &&
        input.coord.every(v => Number.isInteger(v) && v >= 0 && v < 9) &&
        isSaneNumber(input.timestamp, Number.MAX_SAFE_INTEGER);
    case 'roof-running':
      return input.type === 'click' && Number.isInteger(input.index) && isSaneNumber(input.index, 87);
    case 'lockpick':
    case 'laundromat':
      return input.type === 'unlock' || (input.type === 'rotate' && (input.direction === -1 || input.direction === 1));
    case 'word-memory': return input.type === 'seen' || input.type === 'new';
    case 'pincracker':
      return (input.type === 'digit' && typeof input.value === 'string' && /^\d$/.test(input.value)) ||
        input.type === 'backspace' || input.type === 'crack' ||
        (input.type === 'finish' && typeof input.autoClear === 'boolean');
    default: return false;
  }
}
