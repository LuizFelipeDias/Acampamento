export type MetodoPagamento = 'DINHEIRO' | 'PIX' | 'CARTAO_DEBITO' | 'CARTAO_CREDITO' | 'FIADO';

export const METODOS_PAGAMENTO: { valor: MetodoPagamento; rotulo: string }[] = [
  { valor: 'DINHEIRO', rotulo: 'Dinheiro' },
  { valor: 'PIX', rotulo: 'PIX' },
  { valor: 'CARTAO_DEBITO', rotulo: 'Cartão de débito' },
  { valor: 'CARTAO_CREDITO', rotulo: 'Cartão de crédito' },
  { valor: 'FIADO', rotulo: 'Fiado' },
];

export interface UsuarioRequest {
  nome: string;
  idade: number | null;
  telefone: string;
  responsaveis: string;
  telefoneResponsavel: string;
  frequentaIgreja: boolean;
  igreja: string;
  frequentaGap: boolean;
  restricaoAlimentar: string;
  alergia: string;
  medicamentoContinuo: string;
}

export interface Usuario {
  id: number;
  nome: string;
  idade: number;
  telefone: string | null;
  responsaveis: string | null;
  telefoneResponsavel: string | null;
  frequentaIgreja: boolean;
  igreja: string | null;
  frequentaGap: boolean;
  restricaoAlimentar: string | null;
  alergia: string | null;
  medicamentoContinuo: string | null;
  criadoEm: string;
}

export interface Checkin {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  dataHora: string;
}

export interface ProdutoRequest {
  nome: string;
  preco: number;
  estoque: number;
}

export interface Produto extends ProdutoRequest {
  id: number;
  ativo: boolean;
}

export interface PedidoRequest {
  usuarioId: number;
  metodoPagamento: MetodoPagamento;
  itens: { produtoId: number; quantidade: number }[];
}

export interface Pedido {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  dataHora: string;
  metodoPagamento: MetodoPagamento;
  valorTotal: number;
  itens: {
    produtoId: number;
    produtoNome: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
  }[];
}
