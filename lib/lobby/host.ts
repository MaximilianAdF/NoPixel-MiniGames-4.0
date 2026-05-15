interface CandidateMember {
  clientId: string;
  timestamp: number;
}

// Host = earliest-joined member by Ably presence timestamp; clientId tiebreaks.
// Both clients see the same presence + timestamps from Ably's server, so this
// is a deterministic agreement without any extra coordination message.
export function determineHost<T extends CandidateMember>(members: T[]): string | undefined {
  if (members.length === 0) return undefined;
  const sorted = [...members].sort((a, b) => {
    if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
    return a.clientId.localeCompare(b.clientId);
  });
  return sorted[0].clientId;
}
