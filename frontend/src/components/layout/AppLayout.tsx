import { NavLink, Outlet } from 'react-router-dom';
import { IconeCasa, IconeCheckin, IconeSacola } from './icones';
import styles from './AppLayout.module.css';

const itens = [
  { para: '/', rotulo: 'Home', Icone: IconeCasa, fim: true },
  { para: '/checkin', rotulo: 'Check-in', Icone: IconeCheckin, fim: false },
  { para: '/cantina', rotulo: 'Cantina', Icone: IconeSacola, fim: false },
];

export function AppLayout() {
  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.marca}>Acampamento Gap</div>
        <nav className={styles.nav} aria-label="Principal">
          {itens.map(({ para, rotulo, Icone, fim }) => (
            <NavLink
              key={para}
              to={para}
              end={fim}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.ativo : ''}`}
            >
              <Icone />
              {rotulo}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className={styles.conteudo}>
        <div className={styles.pagina}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
