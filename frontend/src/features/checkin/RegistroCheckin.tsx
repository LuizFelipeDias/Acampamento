import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ApiError, mensagemDeErro } from '../../api/client';
import { checkinsApi } from '../../api/endpoints';
import type { UsuarioRequest } from '../../api/types';
import { Aviso, BarraAcoes, Botao, Campo, Cartao, SimNao } from '../../components/ui';
import s from './RegistroCheckin.module.css';

interface Formulario {
  nome: string;
  idade: string;
  telefone: string;
  responsaveis: string;
  telefoneResponsavel: string;
  frequentaIgreja: boolean;
  igreja: string;
  temRestricao: boolean;
  restricaoAlimentar: string;
  frequentaGap: boolean;
  temAlergia: boolean;
  alergia: string;
  usaMedicamento: boolean;
  medicamentoContinuo: string;
}

const VAZIO: Formulario = {
  nome: '', idade: '', telefone: '', responsaveis: '', telefoneResponsavel: '',
  frequentaIgreja: false, igreja: '', temRestricao: false, restricaoAlimentar: '',
  frequentaGap: false, temAlergia: false, alergia: '', usaMedicamento: false, medicamentoContinuo: '',
};

type Erros = Partial<Record<keyof Formulario, string>>;

function validar(f: Formulario): Erros {
  const erros: Erros = {};
  if (!f.nome.trim()) erros.nome = 'Informe o nome.';
  const idade = Number(f.idade);
  if (f.idade === '' || !Number.isInteger(idade) || idade < 0 || idade > 120) erros.idade = 'Idade inválida.';
  if (f.temRestricao && !f.restricaoAlimentar.trim()) erros.restricaoAlimentar = 'Descreva a restrição.';
  if (f.temAlergia && !f.alergia.trim()) erros.alergia = 'Descreva a alergia.';
  if (f.usaMedicamento && !f.medicamentoContinuo.trim()) erros.medicamentoContinuo = 'Informe o medicamento.';
  return erros;
}

/** Converte o formulário (perguntas Sim/Não + "Qual?") para o contrato da API. */
function paraRequisicao(f: Formulario): UsuarioRequest {
  return {
    nome: f.nome.trim(),
    idade: Number(f.idade),
    telefone: f.telefone,
    responsaveis: f.responsaveis,
    telefoneResponsavel: f.telefoneResponsavel,
    frequentaIgreja: f.frequentaIgreja,
    igreja: f.frequentaIgreja ? f.igreja : '',
    frequentaGap: f.frequentaGap,
    restricaoAlimentar: f.temRestricao ? f.restricaoAlimentar : '',
    alergia: f.temAlergia ? f.alergia : '',
    medicamentoContinuo: f.usaMedicamento ? f.medicamentoContinuo : '',
  };
}

export function RegistroCheckin() {
  const [form, setForm] = useState<Formulario>(VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const definir = <K extends keyof Formulario>(campo: K, valor: Formulario[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const texto = (campo: keyof Formulario) => ({
    value: form[campo] as string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => definir(campo, e.target.value),
    erro: erros[campo],
  });

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setResultado(null);
    const errosLocais = validar(form);
    setErros(errosLocais);
    if (Object.keys(errosLocais).length > 0) return;

    setEnviando(true);
    try {
      const checkin = await checkinsApi.registrarNovo(paraRequisicao(form));
      setResultado({
        tipo: 'sucesso',
        texto: `${checkin.usuarioNome} registrado(a) com o número ${checkin.usuarioId}.`,
      });
      setForm(VAZIO);
    } catch (erro) {
      if (erro instanceof ApiError) setErros(erro.campos as Erros);
      setResultado({ tipo: 'erro', texto: mensagemDeErro(erro) });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Cartao>
      {resultado && <Aviso tipo={resultado.tipo}>{resultado.texto}</Aviso>}
      <form onSubmit={enviar} noValidate>
        <div className={s.grade}>
          <Campo className={s.nome} rotulo="Nome" autoComplete="off" {...texto('nome')} />
          <Campo className={s.idade} rotulo="Idade" type="number" min={0} max={120} inputMode="numeric" {...texto('idade')} />
          <Campo className={s.telefone} rotulo="Telefone" type="tel" {...texto('telefone')} />
          <Campo className={s.responsaveis} rotulo="Responsáveis" {...texto('responsaveis')} />
          <Campo className={s.telResponsavel} rotulo="Telefone do responsável" type="tel" {...texto('telefoneResponsavel')} />

          <h2 className={s.secao}>Igreja e Gap</h2>
          <div className={s.pergunta}>
            <SimNao rotulo="Frequenta alguma igreja?" valor={form.frequentaIgreja} onChange={(v) => definir('frequentaIgreja', v)} />
            {form.frequentaIgreja && <Campo rotulo="Qual?" {...texto('igreja')} />}
          </div>
          <div className={s.pergunta}>
            <SimNao rotulo="Frequenta o Gap?" valor={form.frequentaGap} onChange={(v) => definir('frequentaGap', v)} />
          </div>

          <h2 className={s.secao}>Saúde</h2>
          <div className={s.pergunta}>
            <SimNao rotulo="Restrição alimentar?" valor={form.temRestricao} onChange={(v) => definir('temRestricao', v)} />
            {form.temRestricao && <Campo rotulo="Qual?" {...texto('restricaoAlimentar')} />}
          </div>
          <div className={s.pergunta}>
            <SimNao rotulo="Alergia?" valor={form.temAlergia} onChange={(v) => definir('temAlergia', v)} />
            {form.temAlergia && <Campo rotulo="Qual?" {...texto('alergia')} />}
          </div>
          <div className={s.pergunta}>
            <SimNao rotulo="Uso contínuo de medicamento?" valor={form.usaMedicamento} onChange={(v) => definir('usaMedicamento', v)} />
            {form.usaMedicamento && <Campo rotulo="Qual?" {...texto('medicamentoContinuo')} />}
          </div>
        </div>

        <BarraAcoes>
          <Botao type="button" variante="secundario" onClick={() => { setForm(VAZIO); setErros({}); }}>
            Limpar
          </Botao>
          <Botao type="submit" disabled={enviando}>{enviando ? 'Registrando…' : 'Register'}</Botao>
        </BarraAcoes>
      </form>
    </Cartao>
  );
}
