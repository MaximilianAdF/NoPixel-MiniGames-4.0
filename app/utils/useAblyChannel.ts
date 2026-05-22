'use client';

import { useEffect, useRef, useState } from 'react';
import * as Ably from 'ably';

export type ChannelStatus = 'connecting' | 'connected' | 'disconnected' | 'failed';

export interface PresenceData {
  displayName: string;
  // Discord identity, when available — used to compose the avatar URL and
  // link to the user's profile page. Optional so guests still fit.
  discordId?: string;
  avatarHash?: string;
}

export interface PresenceMember {
  clientId: string;
  data: PresenceData;
  // Ably-server timestamp (ms since epoch) — both clients see the same value, so
  // it's a deterministic basis for host determination.
  timestamp: number;
}

interface UseAblyChannelArgs<TMsg> {
  channelName: string;
  presenceData: PresenceData;
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

  const presenceDataKey = JSON.stringify(presenceData);

  useEffect(() => {
    if (!enabled) {
      setStatus('disconnected');
      setPresence([]);
      return;
    }

    let cancelled = false;
    // echoMessages: false — we apply our own actions locally before publishing,
    // so we don't want them echoed back and double-applied (especially the
    // match:input stream that drives the spectator view).
    const client = new Ably.Realtime({ authUrl: '/api/ably/token', echoMessages: false });

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
        // Dedupe by clientId — the same user across multiple tabs/connections counts once.
        const byClientId = new Map<string, PresenceMember>();
        for (const m of members) {
          if (!m.clientId) continue;
          byClientId.set(m.clientId, {
            clientId: m.clientId,
            data: (m.data ?? { displayName: '' }) as PresenceData,
            timestamp: m.timestamp ?? 0,
          });
        }
        setPresence(Array.from(byClientId.values()));
      } catch (err) {
        console.error('Failed to fetch presence:', err);
      }
    };

    // Wrap subscribe + enter in one async fn with one try/catch. Without this,
    // React's strict-mode double-mount can close the client mid-attach and the
    // in-flight subscribe/enter Promises reject unhandled.
    const setup = async () => {
      try {
        await channel.presence.subscribe(() => {
          void refreshPresence();
        });
        await channel.subscribe((msg) => {
          if (cancelled) return;
          onMessageRef.current?.(msg.data as TMsg);
        });
        await channel.presence.enter(JSON.parse(presenceDataKey));
        await refreshPresence();
      } catch (err) {
        if (!cancelled) console.error('Failed to set up Ably channel:', err);
      }
    };
    void setup();

    return () => {
      cancelled = true;
      void channel.presence.leave().catch(() => {});
      channel.unsubscribe();
      channel.presence.unsubscribe();
      client.close();
      channelRef.current = null;
    };
  }, [enabled, channelName, presenceDataKey]);

  const publish = async (msg: TMsg) => {
    if (!channelRef.current) {
      throw new Error('Cannot publish: channel not connected');
    }
    await channelRef.current.publish('msg', msg);
  };

  return { status, presence, publish };
}
