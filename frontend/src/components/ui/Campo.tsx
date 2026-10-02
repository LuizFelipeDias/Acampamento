import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import s from './ui.module.css';

interface Moldura {
  rotulo: string;
  erro?: string;
  className?: string;
}

function MolduraCampo({ rotulo, erro, className, id, children }: Moldura & { id: string; children: ReactNode }) {
  return (
    <div className={`${s.campo} ${className ?? ''}`}>
      <label className={s.rotulo} htmlFor={id}>{rotulo}</label>
      {children}
      {erro && <span className={s.mensagemErro} id={`${id}-erro`}>{erro}</span>}
    </div>
  );
}

type CampoProps = Moldura & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

export function Campo({ rotulo, erro, className, ...input }: CampoProps) {
  const id = useId();
  return (
    <MolduraCampo rotulo={rotulo} erro={erro} className={className} id={id}>
      <input
        id={id}
        className={`${s.entrada} ${erro ? s.entradaErro : ''}`}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        {...input}
      />
    </MolduraCampo>
  );
}

type SelecaoProps = Moldura & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> & {
  opcoes: { valor: string | number; rotulo: string }[];
  vazio?: string;
};

export function CampoSelecao({ rotulo, erro, className, opcoes, vazio, ...select }: SelecaoProps) {
  const id = useId();
  return (
    <MolduraCampo rotulo={rotulo} erro={erro} className={className} id={id}>
      <select id={id} className={`${s.entrada} ${erro ? s.entradaErro : ''}`} {...select}>
        {vazio !== undefined && <option value="">{vazio}</option>}
        {opcoes.map((o) => <option key={o.valor} value={o.valor}>{o.rotulo}</option>)}
      </select>
    </MolduraCampo>
  );
}
