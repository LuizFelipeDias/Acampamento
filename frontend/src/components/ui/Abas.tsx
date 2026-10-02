import { NavLink } from 'react-router-dom';
import s from './ui.module.css';

export function Abas({ itens }: { itens: { para: string; rotulo: string; fim?: boolean }[] }) {
  return (
    <nav className={s.abas} aria-label="Seções">
      {itens.map((i) => (
        <NavLink
          key={i.para}
          to={i.para}
          end={i.fim}
          className={({ isActive }) => `${s.aba} ${isActive ? s.abaAtiva : ''}`}
        >
          {i.rotulo}
        </NavLink>
      ))}
    </nav>
  );
}
