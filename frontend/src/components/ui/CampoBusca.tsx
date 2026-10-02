import { Campo } from './Campo';
import s from './ui.module.css';

export function CampoBusca(props: { rotulo: string; valor: string; onChange: (v: string) => void }) {
  return (
    <div className={s.busca}>
      <Campo rotulo={props.rotulo} type="search" value={props.valor} onChange={(e) => props.onChange(e.target.value)} />
    </div>
  );
}
