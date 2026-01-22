'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ClientPortalProps {
  children: React.ReactNode;
  selector?: string;
}

export default function ClientPortal({ children, selector = 'body' }: ClientPortalProps) {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  return (mounted && ref.current) ? createPortal(children, ref.current) : null;
}
