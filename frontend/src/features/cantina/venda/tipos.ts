import type { Usuario } from '../../../api/types';

export interface LinhaCarrinho {
  chave: number;
  produtoId: string;
  quantidade: string;
}

export interface ItemConfirmado {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export type EstadoVenda =
  | { etapa: 'participante' }
  | { etapa: 'produtos'; participante: Usuario }
  | { etapa: 'pagamento'; participante: Usuario; itens: ItemConfirmado[] }
  | { etapa: 'concluida'; mensagem: string };
