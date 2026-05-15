'use client';

import { useEffect, useRef, useState } from 'react';
import * as Ably from 'ably';

export type ChannelStatus = 'connecting' | 'connected' | 'disconnected' | 'failed';

export interface PresenceMember {
  clientId: string;
  data: { displayName: string };
}

interface UseAblyChannelArgs<TMsg> {
  channelName: string;
  presenceData: { displayName: string };
  onMessage?: (msg: TMsg) => void;
  enabled?: boolean;
}

interface UseAblyChannelReturn<TMsg> {
  status: ChannelStatus;
  presence: PresenceMember[];
  publish: (msg: TMsg) => Promise<void>;
}

// Connects to an Ably channel via token-auth, enters presence, subscribes to messages,
// and keeps a list of present members. Cleans up on unmount or when args change.
export function useAblyChannel<TMsg>({
  channelName,
  presenceData,
  onMessage,
  enabled = true,
}: UseAblyChannelArgs<TMsg>): UseAblyChannelReturn<TMsg> {
  const [status, setStatus] = useState<ChannelStatus>('connecting');
  const [presence, setPresence] = useState<PresenceMember[]>([]);
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);

  // Mirror onMessage into a ref so the connection effect doesn't re-run when it changes.
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  const presenceDisplayName = presenceData.displayName;

  useEffect(() => {
    if (!enabled) {
      setStatus('disconnected');
      setPresence([]);
      return;
    }

    let cancelled = false;
    const client = new Ably.Realtime({ authUrl: '/api/ably/token' });

    client.connection.on((change) => {
      if (cancelled) return;
      switch (change.current) {
        case 'connecting':
          setStatus('connecting');
          break;
        case 'connected':
          setStatus('connected');
          break;
        case 'failed':
          setStatus('failed');
          break;
        default:
          setStatus('disconnected');
      }
    });

    const channel = client.channels.get(channelName);
    channelRef.current = channel;

    const refreshPresence = async () => {
      try {
        const members = await channel.presence.get();
        if (cancelled) return;
        setPresence(
          members.map((m) => ({
            clientId: m.clientId ?? '',
            data: (m.data ?? { displayName: '' }) as { displayName: string },
          })),
        );
      } catch (err) {
        console.error('Failed to fetch presence:', err);
      }
    };

    channel.presence.subscribe(() => {
      void refreshPresence();
    });

    channel.subscribe((msg) => {
      if (cancelled) return;
      onMessageRef.current?.(msg.data as TMsg);
    });

    void channel.presence
      .enter({ displayName: presenceDisplayName })
      .then(refreshPresence)
      .catch((err) => {
        console.error('Failed to enter presence:', err);
      });

    return () => {
      cancelled = true;
      void channel.presence.leave().catch(() => {});
      channel.unsubscribe();
      channel.presence.unsubscribe();
      client.close();
      channelRef.current = null;
    };
  }, [enabled, channelName, presenceDisplayName]);

  const publish = async (msg: TMsg) => {
    if (!channelRef.current) {
      throw new Error('Cannot publish: channel not connected');
    }
    await channelRef.current.publish('msg', msg);
  };

  return { status, presence, publish };
}
