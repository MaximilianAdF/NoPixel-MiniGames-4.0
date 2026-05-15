'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Swords } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';
import { generateLobbyCode, isValidLobbyCode } from '@/lib/lobby/code';

export default function LobbyLanding() {
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    const code = generateLobbyCode();
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
    router.push(`/lobby/${normalized}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-12">
          <Swords className="w-7 h-7 text-[#54FFA4] mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">1v1</h1>
          <p className="text-white/40 text-sm">Race a friend on the same minigame</p>
        </header>

        {!isLoggedIn ? (
          <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6 text-center">
            <p className="text-white/70 text-sm mb-3">Log in with Discord to play 1v1.</p>
            <Link
              href="/"
              className="text-[#54FFA4] hover:text-[#45e894] text-sm transition-colors"
            >
              ← Back home
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleCreate}
              className="w-full rounded-2xl bg-[#54FFA4] text-[#0a0c10] py-4 font-semibold hover:bg-[#45e894] transition-colors"
            >
              Create a lobby
            </button>

            <div className="flex items-center gap-3 py-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs uppercase tracking-wider">
                or join with code
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleJoin} className="space-y-2">
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
                className="w-full rounded-2xl bg-white/[0.03] border border-white/5 px-4 py-4 text-center text-2xl tracking-[0.3em] font-mono uppercase text-white placeholder-white/15 focus:border-[#54FFA4]/40 focus:outline-none transition-colors"
              />
              {error && <p className="text-red-400/80 text-xs text-center">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white py-4 font-medium transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
