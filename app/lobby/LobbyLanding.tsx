'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Swords, Plus, KeyRound } from 'lucide-react';
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
      setError("That doesn't look like a valid 6-character lobby code.");
      return;
    }
    router.push(`/lobby/${normalized}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <div className="max-w-2xl mx-auto pt-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Swords className="w-12 h-12 text-[#54FFA4]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Play 1v1</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Race a friend on the same minigame. Create a lobby and share the code, or join one.
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 text-center">
            <p className="text-gray-300 mb-2">Log in with Discord to play 1v1.</p>
            <Link href="/" className="text-[#54FFA4] hover:underline text-sm">
              Back to home
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Plus className="w-6 h-6 text-[#54FFA4]" />
                <h2 className="text-xl font-bold text-white">Create a lobby</h2>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Get a 6-character code and share it with your friend.
              </p>
              <button
                onClick={handleCreate}
                className="w-full px-6 py-3 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold hover:bg-[#45e894] transition-colors"
              >
                Create lobby
              </button>
            </div>

            <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <KeyRound className="w-6 h-6 text-[#54FFA4]" />
                <h2 className="text-xl font-bold text-white">Join a lobby</h2>
              </div>
              <form onSubmit={handleJoin} className="space-y-3">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="ABC234"
                  maxLength={6}
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full px-4 py-3 bg-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-lg text-white text-center text-2xl tracking-widest font-mono uppercase placeholder-gray-600 focus:border-[#54FFA4] focus:outline-none transition-colors"
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
