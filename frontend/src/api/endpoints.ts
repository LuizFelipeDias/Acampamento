import { api } from './client';
import type {
  Checkin, Pedido, PedidoRequest, Produto, ProdutoRequest, Usuario, UsuarioRequest,
} from './types';

const query = (params: Record<string, string | number | boolean | undefined>) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
};

export const usuariosApi = {
  buscar: (busca?: string) => api.get<Usuario[]>(`/usuarios${query({ busca })}`),
  porId: (id: number) => api.get<Usuario>(`/usuarios/${id}`),
};

export const checkinsApi = {
  registrarNovo: (dados: UsuarioRequest) => api.post<Checkin>('/checkins', dados),
  registrarEntrada: (usuarioId: number) => api.post<Checkin>(`/checkins/usuario/${usuarioId}`),
  listar: (usuarioId?: number) => api.get<Checkin[]>(`/checkins${query({ usuarioId })}`),
};

export const produtosApi = {
  listar: (somenteAtivos = true) => api.get<Produto[]>(`/produtos${query({ somenteAtivos })}`),
  criar: (dados: ProdutoRequest) => api.post<Produto>('/produtos', dados),
  atualizar: (id: number, dados: ProdutoRequest) => api.put<Produto>(`/produtos/${id}`, dados),
  desativar: (id: number) => api.delete(`/produtos/${id}`),
  reativar: (id: number) => api.post<Produto>(`/produtos/${id}/reativar`),
};

export const pedidosApi = {
  criar: (dados: PedidoRequest) => api.post<Pedido>('/pedidos', dados),
  listar: (usuarioId?: number) => api.get<Pedido[]>(`/pedidos${query({ usuarioId })}`),
};
