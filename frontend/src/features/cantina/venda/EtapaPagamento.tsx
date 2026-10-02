import { useState } from 'react';
import { mensagemDeErro } from '../../../api/client';
import { pedidosApi } from '../../../api/endpoints';
import { METODOS_PAGAMENTO, type MetodoPagamento, type Pedido, type Usuario } from '../../../api/types';
import { Aviso, BarraAcoes, Botao, Campo, CampoSelecao, Cartao } from '../../../components/ui';
import { useCarregamento } from '../../../hooks/useCarregamento';
import { formatarMoeda, somarMoeda } from '../../../utils/formatacao';
import type { ItemConfirmado } from './tipos';
import s from './Venda.module.css';

interface Props {
  participante: Usuario;
  itens: ItemConfirmado[];
  onVoltar: () => void;
  onPago: (pedido: Pedido) => void;
}

export function EtapaPagamento({ participante, itens, onVoltar, onPago }: Props) {
  const [metodo, setMetodo] = useState<MetodoPagamento | ''>('');
  const [valorRecebido, setValorRecebido] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const total = somarMoeda(itens.map((i) => i.precoUnitario * i.quantidade));
  const recebido = Number(valorRecebido.replace(',', '.'));
  const troco = metodo === 'DINHEIRO' && recebido >= total ? somarMoeda([recebido, -total]) : null;

  // Quanto o participante já gastou no acampamento (útil para conferir o fiado).
  const anteriores = useCarregamento(() => pedidosApi.listar(participante.id), [participante.id]);
  const totalConta = anteriores.dados
    ? somarMoeda([...anteriores.dados.map((p) => p.valorTotal), total])
    : null;

  async function pagar() {
    if (!metodo) return setErro('Escolha o método de pagamento.');
    if (metodo === 'DINHEIRO' && valorRecebido && recebido < total) {
      return setErro('O valor recebido é menor que o total.');
    }
    setErro(null);
    setEnviando(true);
    try {
      const pedido = await pedidosApi.criar({
        usuarioId: participante.id,
        metodoPagamento: metodo,
        itens: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
      });
      onPago(pedido);
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Cartao>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <div className={s.gradePagamento}>
        <Campo className={s.pagNome} rotulo="Nome" value={`${participante.nome} (Nº ${participante.id})`} readOnly />
        <Campo className={s.pagTotal} rotulo="Total" value={formatarMoeda(total)} readOnly />
        <CampoSelecao className={s.pagMetodo} rotulo="Método de pagamento" vazio="Selecione…"
                      opcoes={METODOS_PAGAMENTO.map((m) => ({ valor: m.valor, rotulo: m.rotulo }))}
                      value={metodo} onChange={(e) => setMetodo(e.target.value as MetodoPagamento | '')} />
        {metodo === 'DINHEIRO' && (
          <>
            <Campo className={s.pagValor} rotulo="Valor recebido" inputMode="decimal" placeholder="0,00"
                   value={valorRecebido} onChange={(e) => setValorRecebido(e.target.value)} />
            <Campo className={s.pagTroco} rotulo="Troco" value={troco === null ? '—' : formatarMoeda(troco)} readOnly />
          </>
        )}
        <Campo className={s.pagConta} rotulo="Total conta (acampamento)" readOnly
               value={totalConta === null ? '…' : formatarMoeda(totalConta)} />
      </div>

      <ul className={s.resumo} aria-label="Itens da compra">
        {itens.map((i) => (
          <li key={i.produtoId}>
            <span>{i.quantidade} × {i.nome}</span>
            <span>{formatarMoeda(i.precoUnitario * i.quantidade)}</span>
          </li>
        ))}
      </ul>

      <BarraAcoes>
        <Botao variante="secundario" onClick={onVoltar} disabled={enviando}>Voltar</Botao>
        <Botao onClick={pagar} disabled={enviando}>{enviando ? 'Registrando…' : 'Pagar'}</Botao>
      </BarraAcoes>
    </Cartao>
  );
}
