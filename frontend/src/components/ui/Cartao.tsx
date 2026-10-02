import type { ReactNode } from 'react';
import s from './ui.module.css';

export function Cartao({ children }: { children: ReactNode }) {
  return <section className={s.cartao}>{children}</section>;
}

export function BarraAcoes({ children }: { children: ReactNode }) {
  return <div className={s.barraAcoes}>{children}</div>;
}
