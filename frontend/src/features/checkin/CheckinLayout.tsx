import { Outlet } from 'react-router-dom';
import { Abas, Cabecalho } from '../../components/ui';

export function CheckinLayout() {
  return (
    <>
      <Cabecalho titulo="Check-in" />
      <Abas
        itens={[
          { para: '/checkin', rotulo: 'Registro', fim: true },
          { para: '/checkin/participantes', rotulo: 'Participantes' },
          { para: '/checkin/entradas', rotulo: 'Entradas' },
        ]}
      />
      <Outlet />
    </>
  );
}
