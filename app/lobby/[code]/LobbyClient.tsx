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
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white/70 mb-4">Log in with Discord to join this lobby.</p>
          <Link
            href="/lobby"
            className="text-[#54FFA4] hover:text-[#45e894] text-sm transition-colors"
          >
            ← Lobby home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] p-4 md:p-8">
      <div className="max-w-lg mx-auto pt-12">
        <Link
          href="/lobby"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="text-center mb-12">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Lobby code</p>
          <button
            onClick={handleCopy}
            className="group inline-flex items-center gap-3 px-4 py-2 -mx-4 -my-2 rounded-2xl hover:bg-white/[0.03] transition-colors"
            aria-label="Copy lobby code"
          >
            <span className="text-6xl md:text-7xl font-bold text-white tracking-[0.18em] font-mono">
              {code}
            </span>
            {copied ? (
              <Check className="w-5 h-5 text-[#54FFA4]" />
            ) : (
              <Copy className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
            )}
          </button>
          <p className="text-white/40 text-sm mt-4">Share this with your friend</p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white/90 font-medium text-sm">
              Players <span className="text-white/30">·</span>{' '}
              <span className="text-white/50">{presence.length}</span>
            </h2>
            <ConnectionStatus status={status} />
          </div>

          {presence.length === 0 ? (
            <div className="py-6 text-center">
              <Loader2 className="w-4 h-4 animate-spin text-white/30 mx-auto" />
            </div>
          ) : (
            <ul className="space-y-1">
              {presence.map((member) => (
                <li
                  key={member.clientId}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#54FFA4]" />
                  <span className="text-white/90 text-sm">{member.data.displayName}</span>
                  {member.clientId === user?.id && (
                    <span className="text-white/30 text-xs ml-auto">you</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {status === 'connected' && presence.length === 1 && (
            <p className="text-white/40 text-xs text-center mt-4">
              Waiting for someone to join…
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
      <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
        <span className="w-1.5 h-1.5 rounded-full bg-[#54FFA4]" />
        Live
      </span>
    );
  }
  if (status === 'failed') {
    return <span className="text-xs text-red-400/80">Disconnected</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
      <Loader2 className="w-3 h-3 animate-spin" />
      Connecting
    </span>
  );
}
