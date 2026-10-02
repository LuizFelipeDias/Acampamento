import type { ReactNode } from 'react';
import s from './ui.module.css';

export interface Coluna<T> {
  titulo: string;
  celula: (linha: T) => ReactNode;
  numerica?: boolean;
}

export function Tabela<T>({ colunas, linhas, chave, vazio = 'Nenhum registro.' }: {
  colunas: Coluna<T>[];
  linhas: T[];
  chave: (linha: T) => string | number;
  vazio?: string;
}) {
  return (
    <div className={s.tabelaMoldura}>
      <table className={s.tabela}>
        <thead>
          <tr>
            {colunas.map((c) => (
              <th key={c.titulo} className={c.numerica ? s.numero : undefined}>{c.titulo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.length === 0 ? (
            <tr><td colSpan={colunas.length} className={s.vazio}>{vazio}</td></tr>
          ) : (
            linhas.map((l) => (
              <tr key={chave(l)}>
                {colunas.map((c) => (
                  <td key={c.titulo} className={c.numerica ? s.numero : undefined}>{c.celula(l)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
