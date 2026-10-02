import type { Usuario } from '../../../api/types';
import { Botao, Chip, ListaChips } from '../../../components/ui';
import s from './Venda.module.css';

/** Identifica o comprador e lembra restrições alimentares/alergias na hora da venda. */
export function FaixaParticipante({ participante, onTrocar }: { participante: Usuario; onTrocar?: () => void }) {
  const { restricaoAlimentar, alergia } = participante;
  return (
    <div className={s.participante}>
      <span>
        <span className={s.participanteNome}>{participante.nome}</span>
        <span className={s.participanteNumero}>Nº {participante.id}</span>
      </span>
      {(restricaoAlimentar || alergia) && (
        <ListaChips>
          {restricaoAlimentar && <Chip cor="amarelo">Restrição: {restricaoAlimentar}</Chip>}
          {alergia && <Chip cor="vermelho">Alergia: {alergia}</Chip>}
        </ListaChips>
      )}
      {onTrocar && <Botao variante="fantasma" onClick={onTrocar}>Trocar participante</Botao>}
    </div>
  );
}
