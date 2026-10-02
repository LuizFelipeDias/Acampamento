import { useMemo, useRef, useState } from 'react';
import { produtosApi } from '../../../api/endpoints';
import type { Produto, Usuario } from '../../../api/types';
import { Aviso, Botao, Campo, CampoSelecao, Estado } from '../../../components/ui';
import { useCarregamento } from '../../../hooks/useCarregamento';
import { formatarMoeda, somarMoeda } from '../../../utils/formatacao';
import { FaixaParticipante } from './FaixaParticipante';
import type { ItemConfirmado, LinhaCarrinho } from './tipos';
import s from './Venda.module.css';

interface Props {
  participante: Usuario;
  itensIniciais?: ItemConfirmado[];
  onTrocarParticipante: () => void;
  onComprar: (itens: ItemConfirmado[]) => void;
}

export function EtapaProdutos(props: Props) {
  const { dados, erro, carregando } = useCarregamento(() => produtosApi.listar(true));
  return (
    <>
      <FaixaParticipante participante={props.participante} onTrocar={props.onTrocarParticipante} />
      <Estado carregando={carregando} erro={erro} dados={dados}>
        {(produtos) =>
          produtos.length === 0
            ? <Aviso tipo="info">Nenhum produto ativo. Cadastre produtos na aba Produtos.</Aviso>
            : <Carrinho produtos={produtos} {...props} />}
      </Estado>
    </>
  );
}

function Carrinho({ produtos, itensIniciais, onComprar }: Props & { produtos: Produto[] }) {
  const contador = useRef(0);
  const novaLinha = (produtoId = '', quantidade = '1'): LinhaCarrinho =>
    ({ chave: ++contador.current, produtoId, quantidade });

  const [linhas, setLinhas] = useState<LinhaCarrinho[]>(() =>
    itensIniciais?.length
      ? itensIniciais.map((i) => novaLinha(String(i.produtoId), String(i.quantidade)))
      : [novaLinha()],
  );
  const [erro, setErro] = useState<string | null>(null);

  const porId = useMemo(() => new Map(produtos.map((p) => [String(p.id), p])), [produtos]);

  const subtotal = (l: LinhaCarrinho) => {
    const p = porId.get(l.produtoId);
    const q = Number(l.quantidade);
    return p && q > 0 ? somarMoeda([p.preco * q]) : 0;
  };
  const total = somarMoeda(linhas.map(subtotal));

  const alterar = (chave: number, campo: 'produtoId' | 'quantidade', valor: string) =>
    setLinhas((ls) => ls.map((l) => (l.chave === chave ? { ...l, [campo]: valor } : l)));

  function comprar() {
    const preenchidas = linhas.filter((l) => l.produtoId);
    if (preenchidas.length === 0) return setErro('Escolha ao menos um produto.');
    for (const l of preenchidas) {
      const p = porId.get(l.produtoId)!;
      const q = Number(l.quantidade);
      if (!Number.isInteger(q) || q < 1) return setErro(`Quantidade inválida para ${p.nome}.`);
      if (q > p.estoque) return setErro(`Estoque insuficiente para ${p.nome} (disponível: ${p.estoque}).`);
    }
    setErro(null);
    onComprar(preenchidas.map((l) => {
      const p = porId.get(l.produtoId)!;
      return { produtoId: p.id, nome: p.nome, quantidade: Number(l.quantidade), precoUnitario: p.preco };
    }));
  }

  return (
    <>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      {linhas.map((l) => {
        // Cada produto aparece em uma única linha: some das opções das outras linhas.
        const usados = new Set(linhas.filter((o) => o.chave !== l.chave).map((o) => o.produtoId));
        const opcoes = produtos
          .filter((p) => !usados.has(String(p.id)))
          .map((p) => ({
            valor: p.id,
            rotulo: `${p.nome} — ${formatarMoeda(p.preco)}${p.estoque === 0 ? ' (sem estoque)' : ` (${p.estoque} un.)`}`,
          }));
        return (
          <div key={l.chave} className={s.linha}>
            <CampoSelecao rotulo="Produto" vazio="Selecione…" opcoes={opcoes} value={l.produtoId}
                          onChange={(e) => alterar(l.chave, 'produtoId', e.target.value)} />
            <Campo rotulo="Quantidade" type="number" min={1} inputMode="numeric" value={l.quantidade}
                   onChange={(e) => alterar(l.chave, 'quantidade', e.target.value)} />
            <div className={s.subtotal} aria-label="Subtotal">{formatarMoeda(subtotal(l))}</div>
            <Botao variante="perigo" className={s.remover} disabled={linhas.length === 1}
                   onClick={() => setLinhas((ls) => ls.filter((x) => x.chave !== l.chave))}>
              Remover
            </Botao>
          </div>
        );
      })}

      <div className={s.rodapeCarrinho}>
        <Botao variante="secundario" onClick={() => setLinhas((ls) => [...ls, novaLinha()])}
               disabled={linhas.length >= produtos.length}>
          Adicionar novo produto +
        </Botao>
        <span className={s.total}>Total<strong>{formatarMoeda(total)}</strong></span>
        <Botao onClick={comprar}>Comprar</Botao>
      </div>
    </>
  );
}
