import { useState } from 'react';
import { usuariosApi } from '../../../api/endpoints';
import type { Usuario } from '../../../api/types';
import { Aviso, Campo } from '../../../components/ui';
import { useCarregamento } from '../../../hooks/useCarregamento';
import { useDebounce } from '../../../hooks/useDebounce';
import s from './Venda.module.css';

export function EtapaParticipante({ onEscolher }: { onEscolher: (u: Usuario) => void }) {
  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState('');
  // O número tem prioridade: identifica o participante sem ambiguidade.
  const termo = useDebounce(numero.trim() || (nome.trim().length >= 2 ? nome.trim() : ''), 300);

  const { dados, erro, carregando } = useCarregamento(
    () => (termo ? usuariosApi.buscar(termo) : Promise.resolve<Usuario[]>([])),
    [termo],
  );

  return (
    <>
      <div className={s.identificacao}>
        <Campo rotulo="Nome" placeholder="Digite ao menos 2 letras" value={nome}
               onChange={(e) => { setNome(e.target.value); setNumero(''); }} autoFocus />
        <Campo rotulo="Número" placeholder="Nº do participante" inputMode="numeric" value={numero}
               onChange={(e) => { setNumero(e.target.value.replace(/\D/g, '')); setNome(''); }} />
      </div>

      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      {termo && !carregando && dados?.length === 0 && (
        <Aviso tipo="info">Nenhum participante encontrado. Faça o cadastro na tela de Check-in.</Aviso>
      )}
      {dados && dados.length > 0 && (
        <ul className={s.resultados} aria-label="Participantes encontrados">
          {dados.map((u) => (
            <li key={u.id}>
              <button type="button" className={s.resultado} onClick={() => onEscolher(u)}>
                <span>
                  <span className={s.resultadoNome}>{u.nome}</span>
                  <br />
                  <span className={s.resultadoInfo}>{[u.idade !== null && `${u.idade} anos`, u.responsaveis].filter(Boolean).join(' · ')}</span>
                </span>
                <span className={s.resultadoInfo}>Nº {u.id}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
