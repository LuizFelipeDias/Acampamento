import type { ButtonHTMLAttributes } from 'react';
import s from './ui.module.css';

type Variante = 'primario' | 'secundario' | 'fantasma' | 'perigo';

export function Botao({ variante = 'primario', className, ...props }:
  ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return <button className={`${s.botao} ${s[variante]} ${className ?? ''}`} {...props} />;
}
