import { useId } from 'react';
import s from './ui.module.css';

export function SimNao({ rotulo, valor, onChange }: {
  rotulo: string;
  valor: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className={s.campo}>
      <span className={s.rotulo} id={id}>{rotulo}</span>
      <div className={s.simNao} role="group" aria-labelledby={id}>
        <button type="button" aria-pressed={valor} onClick={() => onChange(true)}>Sim</button>
        <button type="button" aria-pressed={!valor} onClick={() => onChange(false)}>Não</button>
      </div>
    </div>
  );
}
