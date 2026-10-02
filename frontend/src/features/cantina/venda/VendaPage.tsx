import { useState } from 'react';
import { Aviso, Botao } from '../../../components/ui';
import { formatarMoeda, rotuloMetodo } from '../../../utils/formatacao';
import { EtapaPagamento } from './EtapaPagamento';
import { EtapaParticipante } from './EtapaParticipante';
import { EtapaProdutos } from './EtapaProdutos';
import type { EstadoVenda, ItemConfirmado } from './tipos';
import s from './Venda.module.css';

const ETAPAS = [
  { id: 'participante', rotulo: '1. Participante' },
  { id: 'produtos', rotulo: '2. Produtos' },
  { id: 'pagamento', rotulo: '3. Pagamento' },
] as const;

export function VendaPage() {
  const [estado, setEstado] = useState<EstadoVenda>({ etapa: 'participante' });
  // Guarda o carrinho ao voltar do pagamento para os produtos.
  const [carrinho, setCarrinho] = useState<ItemConfirmado[]>([]);

  const indiceAtual = ETAPAS.findIndex((e) => e.id === estado.etapa);
  const recomecar = () => { setCarrinho([]); setEstado({ etapa: 'participante' }); };

  return (
    <>
      {estado.etapa !== 'concluida' && (
        <ol className={s.etapas} aria-label="Etapas da venda">
          {ETAPAS.map((e, i) => (
            <li key={e.id}
                className={`${s.etapa} ${i === indiceAtual ? s.etapaAtual : i < indiceAtual ? s.etapaFeita : ''}`}
                aria-current={i === indiceAtual ? 'step' : undefined}>
              {e.rotulo}
            </li>
          ))}
        </ol>
      )}

      {estado.etapa === 'participante' && (
        <EtapaParticipante onEscolher={(participante) => setEstado({ etapa: 'produtos', participante })} />
      )}

      {estado.etapa === 'produtos' && (
        <EtapaProdutos
          participante={estado.participante}
          itensIniciais={carrinho}
          onTrocarParticipante={recomecar}
          onComprar={(itens) => {
            setCarrinho(itens);
            setEstado({ etapa: 'pagamento', participante: estado.participante, itens });
          }}
        />
      )}

      {estado.etapa === 'pagamento' && (
        <EtapaPagamento
          participante={estado.participante}
          itens={estado.itens}
          onVoltar={() => setEstado({ etapa: 'produtos', participante: estado.participante })}
          onPago={(pedido) => {
            setCarrinho([]);
            setEstado({
              etapa: 'concluida',
              mensagem: `Pedido nº ${pedido.id} registrado: ${pedido.usuarioNome}, ` +
                `${formatarMoeda(pedido.valorTotal)} em ${rotuloMetodo(pedido.metodoPagamento)}.`,
            });
          }}
        />
      )}

      {estado.etapa === 'concluida' && (
        <>
          <Aviso tipo="sucesso">{estado.mensagem}</Aviso>
          <Botao onClick={recomecar}>Nova venda</Botao>
        </>
      )}
    </>
  );
}
