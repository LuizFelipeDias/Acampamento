/** Erro no formato application/problem+json devolvido pela API. */
export class ApiError extends Error {
  readonly status: number;
  readonly campos: Record<string, string>;

  constructor(status: number, mensagem: string, campos: Record<string, string> = {}) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
    this.campos = campos;
  }
}

const BASE = '/api';

async function requisicao<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch(BASE + caminho, {
      method: metodo,
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar à API. Verifique se o backend está rodando.');
  }

  if (resposta.status === 204) return undefined as T;

  const dados: unknown = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const problema = (dados ?? {}) as { detail?: string; title?: string; erros?: Record<string, string> };
    throw new ApiError(
      resposta.status,
      problema.detail ?? problema.title ?? `Erro ${resposta.status}`,
      problema.erros ?? {},
    );
  }
  return dados as T;
}

export const api = {
  get: <T>(caminho: string) => requisicao<T>('GET', caminho),
  post: <T>(caminho: string, corpo?: unknown) => requisicao<T>('POST', caminho, corpo ?? {}),
  put: <T>(caminho: string, corpo: unknown) => requisicao<T>('PUT', caminho, corpo),
  delete: (caminho: string) => requisicao<void>('DELETE', caminho),
};

export function mensagemDeErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Erro inesperado.';
}
