import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { CantinaLayout } from './features/cantina/CantinaLayout';
import { Historico } from './features/cantina/Historico';
import { Produtos } from './features/cantina/Produtos';
import { VendaPage } from './features/cantina/venda/VendaPage';
import { CheckinLayout } from './features/checkin/CheckinLayout';
import { Entradas } from './features/checkin/Entradas';
import { Participantes } from './features/checkin/Participantes';
import { RegistroCheckin } from './features/checkin/RegistroCheckin';
import { HomePage } from './features/home/HomePage';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'checkin',
        element: <CheckinLayout />,
        children: [
          { index: true, element: <RegistroCheckin /> },
          { path: 'participantes', element: <Participantes /> },
          { path: 'entradas', element: <Entradas /> },
        ],
      },
      {
        path: 'cantina',
        element: <CantinaLayout />,
        children: [
          { index: true, element: <VendaPage /> },
          { path: 'historico', element: <Historico /> },
          { path: 'produtos', element: <Produtos /> },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
