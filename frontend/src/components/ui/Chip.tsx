import type { ReactNode } from 'react';
import s from './ui.module.css';

const cores = {
  azul: s.chipAzul, verde: s.chipVerde, amarelo: s.chipAmarelo, vermelho: s.chipVermelho, cinza: s.chipCinza,
};
export type CorChip = keyof typeof cores;

export function Chip({ cor = 'cinza', children }: { cor?: CorChip; children: ReactNode }) {
  return <span className={`${s.chip} ${cores[cor]}`}>{children}</span>;
}

export function ListaChips({ children }: { children: ReactNode }) {
  return <div className={s.chips}>{children}</div>;
}
