'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Swords, ArrowRight } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';
import { generateLobbyCode, isValidLobbyCode } from '@/lib/lobby/code';
import { trackLobbyCreated, trackLobbyJoined } from '@/app/utils/gtm';

export default function LobbyLanding() {
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    const code = generateLobbyCode();
    trackLobbyCreated({ lobby_code: code });
    router.push(`/lobby/${code}`);
  };

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const normalized = joinCode.toUpperCase().trim();
    if (!isValidLobbyCode(normalized)) {
      setError('Invalid code — should be 6 characters.');
      return;
    }
    trackLobbyJoined({ lobby_code: normalized });
    router.push(`/lobby/${normalized}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-sm transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back home
        </Link>

        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#54FFA4]/10 border border-[#54FFA4]/25 mb-5 shadow-lg shadow-[#54FFA4]/5">
            <Swords className="w-7 h-7 text-[#54FFA4]" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">1v1 Mode</h1>
          <p className="text-white/40 text-sm">Race a friend on the same minigame</p>
        </header>

        {!isLoggedIn ? (
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 text-center">
            <p className="text-white/70 text-sm mb-4">Log in with Discord to play 1v1.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[#54FFA4] hover:text-[#45e894] text-sm font-medium transition-colors"
            >
              Back home
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleCreate}
              className="group w-full rounded-2xl bg-[#54FFA4] hover:bg-[#45e894] text-[#0a0c10] py-4 font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-[#54FFA4]/20 active:scale-[0.99]"
            >
              <span className="inline-flex items-center gap-2">
                Create a lobby
                <ArrowRight className="w-4 h-4 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
              </span>
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-white/25 text-[10px] uppercase tracking-[0.25em] font-semibold">
                or join with code
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <form onSubmit={handleJoin} className="space-y-3">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase());
                  if (error) setError('');
                }}
                placeholder="ABCDEF"
                maxLength={6}
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-[#54FFA4]/40 focus:bg-white/[0.05] px-4 py-4 text-center text-2xl tracking-[0.3em] font-mono uppercase text-white placeholder-white/15 focus:outline-none transition-colors"
              />
              {error && (
                <p className="text-red-400/80 text-xs text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={joinCode.length === 0}
                className="w-full rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/15 text-white/90 py-4 font-medium transition-all duration-200 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/[0.04] disabled:hover:border-white/[0.06]"
              >
                Join lobby
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
