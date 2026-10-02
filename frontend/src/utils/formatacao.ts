import { METODOS_PAGAMENTO, type MetodoPagamento } from '../api/types';

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dataHora = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export const formatarMoeda = (valor: number) => moeda.format(valor);
export const formatarDataHora = (iso: string) => dataHora.format(new Date(iso));

export const rotuloMetodo = (m: MetodoPagamento) =>
  METODOS_PAGAMENTO.find((x) => x.valor === m)?.rotulo ?? m;

/** Soma em centavos para não acumular erro de ponto flutuante. */
export const somarMoeda = (valores: number[]) =>
  valores.reduce((acc, v) => acc + Math.round(v * 100), 0) / 100;
