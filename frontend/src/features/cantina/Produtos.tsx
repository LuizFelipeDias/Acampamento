import { useState, type FormEvent } from 'react';
import { ApiError, mensagemDeErro } from '../../api/client';
import { produtosApi } from '../../api/endpoints';
import type { Produto } from '../../api/types';
import { Aviso, Botao, Campo, Chip, Estado, Tabela, type Coluna } from '../../components/ui';
import { useCarregamento } from '../../hooks/useCarregamento';
import { formatarMoeda } from '../../utils/formatacao';
import s from './Produtos.module.css';

interface Formulario { id: number | null; nome: string; preco: string; estoque: string }
const VAZIO: Formulario = { id: null, nome: '', preco: '', estoque: '' };

export function Produtos() {
  const { dados, erro, carregando, recarregar } = useCarregamento(() => produtosApi.listar(false));
  const [form, setForm] = useState<Formulario>(VAZIO);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [aviso, setAviso] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const preco = Number(form.preco.replace(',', '.'));
    const estoque = Number(form.estoque);
    const locais: Record<string, string> = {};
    if (!form.nome.trim()) locais.nome = 'Informe o nome.';
    if (form.preco === '' || Number.isNaN(preco) || preco < 0) locais.preco = 'Preço inválido.';
    if (form.estoque === '' || !Number.isInteger(estoque) || estoque < 0) locais.estoque = 'Estoque inválido.';
    setErros(locais);
    if (Object.keys(locais).length) return;

    try {
      const dadosProduto = { nome: form.nome.trim(), preco, estoque };
      const salvo = form.id === null
        ? await produtosApi.criar(dadosProduto)
        : await produtosApi.atualizar(form.id, dadosProduto);
      setAviso({ tipo: 'sucesso', texto: `${salvo.nome} salvo.` });
      setForm(VAZIO);
      recarregar();
    } catch (err) {
      if (err instanceof ApiError) setErros(err.campos);
      setAviso({ tipo: 'erro', texto: mensagemDeErro(err) });
    }
  }

  async function alternarAtivo(p: Produto) {
    try {
      if (p.ativo) await produtosApi.desativar(p.id);
      else await produtosApi.reativar(p.id);
      recarregar();
    } catch (err) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(err) });
    }
  }

  const colunas: Coluna<Produto>[] = [
    { titulo: 'Produto', celula: (p) => <span className={p.ativo ? undefined : s.inativo}>{p.nome}</span> },
    { titulo: 'Preço', celula: (p) => formatarMoeda(p.preco), numerica: true },
    { titulo: 'Estoque', numerica: true, celula: (p) =>
      p.estoque === 0 ? <Chip cor="vermelho">Esgotado</Chip>
        : p.estoque < 5 ? <Chip cor="amarelo">{p.estoque}</Chip> : p.estoque },
    { titulo: 'Situação', celula: (p) => <Chip cor={p.ativo ? 'verde' : 'cinza'}>{p.ativo ? 'Ativo' : 'Inativo'}</Chip> },
    { titulo: '', celula: (p) => (
      <div className={s.acoes}>
        <Botao variante="fantasma" onClick={() =>
          setForm({ id: p.id, nome: p.nome, preco: String(p.preco), estoque: String(p.estoque) })}>
          Editar
        </Botao>
        <Botao variante={p.ativo ? 'perigo' : 'fantasma'} onClick={() => alternarAtivo(p)}>
          {p.ativo ? 'Desativar' : 'Reativar'}
        </Botao>
      </div>
    ) },
  ];

  return (
    <>
      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      <form className={s.form} onSubmit={salvar} noValidate>
        <Campo rotulo={form.id === null ? 'Novo produto' : `Editando produto #${form.id}`} value={form.nome}
               erro={erros.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        <Campo rotulo="Preço (R$)" inputMode="decimal" placeholder="0,00" value={form.preco}
               erro={erros.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} />
        <Campo rotulo="Estoque" type="number" min={0} inputMode="numeric" value={form.estoque}
               erro={erros.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} />
        <div className={s.acoes}>
          {form.id !== null && (
            <Botao type="button" variante="secundario" onClick={() => { setForm(VAZIO); setErros({}); }}>Cancelar</Botao>
          )}
          <Botao type="submit">Salvar</Botao>
        </div>
      </form>
      <Estado carregando={carregando} erro={erro} dados={dados}>
        {(produtos) => <Tabela colunas={colunas} linhas={produtos} chave={(p) => p.id} vazio="Nenhum produto cadastrado." />}
      </Estado>
    </>
  );
}
