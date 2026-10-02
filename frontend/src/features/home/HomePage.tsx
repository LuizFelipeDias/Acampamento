import { Link } from 'react-router-dom';
import { checkinsApi, pedidosApi, produtosApi, usuariosApi } from '../../api/endpoints';
import { Cabecalho, Estado } from '../../components/ui';
import { IconeCheckin, IconeSacola } from '../../components/layout/icones';
import { useCarregamento } from '../../hooks/useCarregamento';
import { formatarMoeda, somarMoeda } from '../../utils/formatacao';
import s from './Home.module.css';

const ehHoje = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

async function carregarResumo() {
  const [usuarios, checkins, pedidos, produtos] = await Promise.all([
    usuariosApi.buscar(), checkinsApi.listar(), pedidosApi.listar(), produtosApi.listar(true),
  ]);
  const pedidosHoje = pedidos.filter((p) => ehHoje(p.dataHora));
  return {
    participantes: usuarios.length,
    entradasHoje: checkins.filter((c) => ehHoje(c.dataHora)).length,
    vendasHoje: somarMoeda(pedidosHoje.map((p) => p.valorTotal)),
    pedidosHoje: pedidosHoje.length,
    estoqueBaixo: produtos.filter((p) => p.estoque < 5).length,
  };
}

export function HomePage() {
  const { dados, erro, carregando } = useCarregamento(carregarResumo);
  return (
    <>
      <Cabecalho titulo="Acampamento" subtitulo="Painel do dia" />
      <Estado carregando={carregando} erro={erro} dados={dados}>
        {(r) => (
          <div className={s.indicadores}>
            <Indicador valor={r.participantes} legenda="Participantes" />
            <Indicador valor={r.entradasHoje} legenda="Entradas hoje" />
            <Indicador valor={formatarMoeda(r.vendasHoje)} legenda={`Cantina hoje · ${r.pedidosHoje} pedido(s)`} />
            <Indicador valor={r.estoqueBaixo} legenda="Produtos com estoque baixo" />
          </div>
        )}
      </Estado>
      <h2 className={s.secao}>Ações rápidas</h2>
      <div className={s.atalhos}>
        <Link to="/checkin" className={s.atalho}><IconeCheckin width={32} height={32} />Novo check-in</Link>
        <Link to="/cantina" className={s.atalho}><IconeSacola width={32} height={32} />Nova venda</Link>
      </div>
    </>
  );
}

function Indicador({ valor, legenda }: { valor: string | number; legenda: string }) {
  return (
    <div className={s.indicador}>
      <div className={s.valor}>{valor}</div>
      <div className={s.legenda}>{legenda}</div>
    </div>
  );
}
