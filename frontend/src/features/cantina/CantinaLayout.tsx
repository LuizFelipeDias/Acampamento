import { Outlet } from 'react-router-dom';
import { Abas, Cabecalho } from '../../components/ui';

export function CantinaLayout() {
  return (
    <>
      <Cabecalho titulo="Cantina" />
      <Abas
        itens={[
          { para: '/cantina', rotulo: 'Venda', fim: true },
          { para: '/cantina/historico', rotulo: 'Histórico' },
          { para: '/cantina/produtos', rotulo: 'Produtos' },
        ]}
      />
      <Outlet />
    </>
  );
}
