import { useMemo, useState } from 'react';
import { pedidosApi } from '../../api/endpoints';
import type { MetodoPagamento, Pedido } from '../../api/types';
import { CampoBusca, Chip, Estado, ListaChips, Tabela, type Coluna, type CorChip } from '../../components/ui';
import { useCarregamento } from '../../hooks/useCarregamento';
import { formatarDataHora, formatarMoeda, rotuloMetodo, somarMoeda } from '../../utils/formatacao';
import s from './Historico.module.css';

const corMetodo: Record<MetodoPagamento, CorChip> = {
  DINHEIRO: 'verde', PIX: 'azul', CARTAO_DEBITO: 'cinza', CARTAO_CREDITO: 'cinza', FIADO: 'amarelo',
};

const colunas: Coluna<Pedido>[] = [
  { titulo: 'Data', celula: (p) => formatarDataHora(p.dataHora), semQuebra: true },
  { titulo: 'Pedido', celula: (p) => `#${p.id}`, numerica: true },
  { titulo: 'Participante', celula: (p) => <strong>{p.usuarioNome}</strong>, semQuebra: true },
  { titulo: 'Itens', celula: (p) => (
    <ListaChips>{p.itens.map((i) => <Chip key={i.produtoId}>{i.quantidade} × {i.produtoNome}</Chip>)}</ListaChips>
  ) },
  { titulo: 'Pagamento', celula: (p) => <Chip cor={corMetodo[p.metodoPagamento]}>{rotuloMetodo(p.metodoPagamento)}</Chip> },
  { titulo: 'Total', celula: (p) => formatarMoeda(p.valorTotal), numerica: true },
];

export function Historico() {
  const { dados, erro, carregando } = useCarregamento(() => pedidosApi.listar());
  const [filtro, setFiltro] = useState('');

  const filtrados = useMemo(() => {
    const f = filtro.trim().toLowerCase();
    if (!dados || !f) return dados;
    return dados.filter((p) => p.usuarioNome.toLowerCase().includes(f) || String(p.usuarioId) === f);
  }, [dados, filtro]);

  return (
    <>
      <CampoBusca rotulo="Filtrar por participante (nome ou número)" valor={filtro} onChange={setFiltro} />
      <Estado carregando={carregando} erro={erro} dados={filtrados}>
        {(pedidos) => (
          <>
            <p className={s.resumo}>
              {pedidos.length} pedido(s) · total {formatarMoeda(somarMoeda(pedidos.map((p) => p.valorTotal)))}
            </p>
            <Tabela colunas={colunas} linhas={pedidos} chave={(p) => p.id} vazio="Nenhuma compra registrada." />
          </>
        )}
      </Estado>
    </>
  );
}
