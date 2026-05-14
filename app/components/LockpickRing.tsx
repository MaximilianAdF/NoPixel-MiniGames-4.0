'use client';

import { memo, Fragment } from 'react';
import { degInterval, type Ring } from './lockpickEngine';

interface LockpickRingProps {
  ring: Ring;
  ringIndex: number;
  level: number;
  status: number;
}

// One lock ring -- the track circle, its balls, and its target slots. Memoized so a rotation
// only re-renders the ring that moved.
export const LockpickRing = memo<LockpickRingProps>(({ ring, ringIndex, level, status }) => {
  const radius = (ringIndex + 1) * 50 - 10;
  const slotRadius = radius + 15;
  const cleared = level > ringIndex || status === 3;
  const failed = status === 2 && level === ringIndex;
  const resolved = cleared ? 'win' : failed ? 'fail' : null;

  return (
    <Fragment>
      <circle
        className="fill-none stroke-[3px]"
        data-stroke={resolved ?? 'gray'}
        cx="50%"
        cy="50%"
        r={radius}
      />
      <g className="*:ease-in-out *:transition-transform *:duration-200">
        {ring.balls.map((ball, index) => (
          <circle
            key={index}
            style={{
              transform: `rotate(${(ball + ring.rotation) * degInterval}deg) translateX(${radius}px)`,
            }}
            data-fill={resolved ?? ring.color[ball]}
            cx="50%"
            cy="50%"
            r="8.5px"
          />
        ))}
      </g>
      <g className="*:fill-none *:stroke-[5px]">
        {ring.slots.map((slot, index) => (
          <circle
            key={index}
            data-r-px={slotRadius}
            cx="50%"
            cy="50%"
            r={slotRadius}
            data-stroke={resolved ?? ring.color[slot]}
            style={{
              transform: `rotate(${-15 + slot * degInterval}deg)`,
              strokeDasharray: `${2 * slotRadius * Math.PI}`,
              strokeDashoffset: `${(11 * (2 * slotRadius * Math.PI)) / 12}`,
            }}
          />
        ))}
      </g>
    </Fragment>
  );
});

LockpickRing.displayName = 'LockpickRing';
