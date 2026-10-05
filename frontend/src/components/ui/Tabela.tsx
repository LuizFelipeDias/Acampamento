import { useState, type ReactNode } from 'react';
import s from './ui.module.css';

export interface Coluna<T> {
  titulo: string;
  celula: (linha: T) => ReactNode;
  numerica?: boolean;
  /** Mantém o conteúdo em uma linha (nomes, telefones, datas). */
  semQuebra?: boolean;
}

function classeDa<T>(c: Coluna<T>) {
  return [c.numerica && s.numero, c.semQuebra && s.semQuebra].filter(Boolean).join(' ') || undefined;
}

export function Tabela<T>({ colunas, linhas, chave, vazio = 'Nenhum registro.', porPagina = 10 }: {
  colunas: Coluna<T>[];
  linhas: T[];
  chave: (linha: T) => string | number;
  vazio?: string;
  porPagina?: number;
}) {
  const [pagina, setPagina] = useState(1);
  const totalPaginas = Math.max(1, Math.ceil(linhas.length / porPagina));
  // Se um filtro reduzir a lista, a página atual se ajusta sozinha.
  const atual = Math.min(pagina, totalPaginas);
  const inicio = (atual - 1) * porPagina;
  const visiveis = linhas.slice(inicio, inicio + porPagina);

  return (
    <>
      <div className={s.tabelaMoldura}>
        <table className={s.tabela}>
          <thead>
            <tr>
              {colunas.map((c) => (
                <th key={c.titulo} className={classeDa(c)}>{c.titulo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visiveis.length === 0 ? (
              <tr><td colSpan={colunas.length} className={s.vazio}>{vazio}</td></tr>
            ) : (
              visiveis.map((l) => (
                <tr key={chave(l)}>
                  {colunas.map((c) => (
                    <td key={c.titulo} className={classeDa(c)}>{c.celula(l)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {linhas.length > porPagina && (
        <nav className={s.paginacao} aria-label="Paginação">
          <span>
            {inicio + 1}–{Math.min(inicio + porPagina, linhas.length)} de {linhas.length}
          </span>
          <div className={s.paginacaoBotoes}>
            <button type="button" onClick={() => setPagina(atual - 1)} disabled={atual === 1}>‹ Anterior</button>
            <span aria-live="polite">Página {atual} de {totalPaginas}</span>
            <button type="button" onClick={() => setPagina(atual + 1)} disabled={atual === totalPaginas}>Próxima ›</button>
          </div>
        </nav>
      )}
    </>
  );
}
