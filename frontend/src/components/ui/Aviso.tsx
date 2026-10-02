import type { ReactNode } from 'react';
import s from './ui.module.css';

const classes = { sucesso: s.avisoSucesso, erro: s.avisoErro, info: s.avisoInfo };

export function Aviso({ tipo, children }: { tipo: keyof typeof classes; children: ReactNode }) {
  return (
    <div className={`${s.aviso} ${classes[tipo]}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
