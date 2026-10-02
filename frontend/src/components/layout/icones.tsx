import type { SVGProps } from 'react';

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 40, height: 40, viewBox: '0 0 48 48', fill: 'none',
  stroke: 'currentColor', strokeWidth: 3, strokeLinejoin: 'round' as const,
  'aria-hidden': true, ...props,
});

export const IconeCasa = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 22 24 6l18 16" />
    <path d="M10 19v23h10V30h8v12h10V19" />
    <path d="M34 9v6" />
  </svg>
);

export const IconeCheckin = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="6" y="6" width="36" height="36" rx="5" />
    <circle cx="24" cy="19" r="6" fill="currentColor" stroke="none" />
    <path d="M12 42c0-7 5-12 12-12s12 5 12 12" fill="currentColor" stroke="none" />
  </svg>
);

export const IconeSacola = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="6" y="16" width="36" height="26" rx="4" />
    <path d="M17 16v-3a7 7 0 0 1 14 0v3" />
  </svg>
);
