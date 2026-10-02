import s from './ui.module.css';

export function Cabecalho({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <header className={s.cabecalho}>
      <h1 className={s.titulo}>{titulo}</h1>
      {subtitulo && <p className={s.subtitulo}>{subtitulo}</p>}
    </header>
  );
}
