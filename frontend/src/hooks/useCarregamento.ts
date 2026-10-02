import { useCallback, useEffect, useState } from 'react';
import { mensagemDeErro } from '../api/client';

/** Carrega dados de uma função assíncrona e expõe estado de carregamento, erro e recarga. */
export function useCarregamento<T>(carregar: () => Promise<T>, deps: unknown[] = []) {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [versao, setVersao] = useState(0);

  const carregarMemo = useCallback(carregar, deps);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);
    carregarMemo()
      .then((d) => { if (ativo) setDados(d); })
      .catch((e) => { if (ativo) setErro(mensagemDeErro(e)); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [carregarMemo, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);
  return { dados, erro, carregando, recarregar };
}
