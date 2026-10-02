import type { ReactNode } from 'react';
import { Aviso } from './Aviso';
import s from './ui.module.css';

/** Mostra carregamento ou erro; renderiza o conteúdo quando os dados estão prontos. */
export function Estado<T>({ carregando, erro, dados, children }: {
  carregando: boolean;
  erro: string | null;
  dados: T | null;
  children: (dados: T) => ReactNode;
}) {
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (carregando || dados === null) return <p className={s.carregando}>Carregando…</p>;
  return <>{children(dados)}</>;
}
