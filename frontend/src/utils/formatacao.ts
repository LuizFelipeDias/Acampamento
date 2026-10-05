import { METODOS_PAGAMENTO, type MetodoPagamento } from '../api/types';

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dataHora = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export const formatarMoeda = (valor: number) => moeda.format(valor);
export const formatarDataHora = (iso: string) => dataHora.format(new Date(iso));

/** 42999998888 → (42) 99999-8888; números fora do padrão são exibidos como vieram. */
export function formatarTelefone(digitos: string | null): string {
  if (!digitos) return '—';
  const m = /^(\d{2})(\d{4,5})(\d{4})$/.exec(digitos);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : digitos;
}

export const rotuloMetodo = (m: MetodoPagamento) =>
  METODOS_PAGAMENTO.find((x) => x.valor === m)?.rotulo ?? m;

/** Soma em centavos para não acumular erro de ponto flutuante. */
export const somarMoeda = (valores: number[]) =>
  valores.reduce((acc, v) => acc + Math.round(v * 100), 0) / 100;
