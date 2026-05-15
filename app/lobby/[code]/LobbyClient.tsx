'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, Loader2 } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';
import { useAblyChannel, type ChannelStatus } from '@/app/utils/useAblyChannel';

interface LobbyClientProps {
  code: string;
}

export default function LobbyClient({ code }: LobbyClientProps) {
  const { user, isLoggedIn } = useUser();
  const [copied, setCopied] = useState(false);

  const displayName = user?.displayName ?? user?.username ?? 'Player';

  const { status, presence } = useAblyChannel({
    channelName: `lobby:${code}`,
    presenceData: { displayName },
    enabled: isLoggedIn,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silent fail — user can still read and copy manually.
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
        <div className="max-w-2xl mx-auto pt-16 text-center">
          <p className="text-gray-300 mb-6">Log in with Discord to join this lobby.</p>
          <Link href="/lobby" className="text-[#54FFA4] hover:underline">
            Back to lobby home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <div className="max-w-2xl mx-auto pt-16">
        <Link
          href="/lobby"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#54FFA4] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-6 text-center">
          <p className="text-gray-400 text-sm mb-2">Lobby code — share to invite</p>
          <button
            onClick={handleCopy}
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-[#0F1B21]/50 transition-colors"
            aria-label="Copy lobby code"
          >
            <span className="text-5xl md:text-6xl font-bold text-[#54FFA4] tracking-widest font-mono">
              {code}
            </span>
            {copied ? (
              <Check className="w-6 h-6 text-[#54FFA4]" />
            ) : (
              <Copy className="w-6 h-6 text-gray-400 group-hover:text-[#54FFA4] transition-colors" />
            )}
          </button>
        </div>

        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Players ({presence.length})</h2>
            <ConnectionStatus status={status} />
          </div>

          {presence.length === 0 ? (
            <p className="text-gray-400 text-sm">Connecting…</p>
          ) : (
            <ul className="space-y-2">
              {presence.map((member) => (
                <li
                  key={member.clientId}
                  className="flex items-center gap-3 px-3 py-2 bg-[#0F1B21]/50 rounded-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-[#54FFA4]" />
                  <span className="text-white">{member.data.displayName}</span>
                  {member.clientId === user?.id && (
                    <span className="text-gray-500 text-xs">(you)</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {status === 'connected' && presence.length === 1 && (
            <p className="text-gray-400 text-sm mt-4">
              Waiting for a friend to join with this code.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ConnectionStatus({ status }: { status: ChannelStatus }) {
  if (status === 'connected') {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-[#54FFA4]">
        <span className="w-2 h-2 rounded-full bg-[#54FFA4]" />
        Connected
      </span>
    );
  }
  if (status === 'failed') {
    return <span className="text-xs text-red-400">Connection failed</span>;
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs text-gray-400">
      <Loader2 className="w-3 h-3 animate-spin" />
      {status === 'connecting' ? 'Connecting…' : 'Disconnected'}
    </span>
  );
}
