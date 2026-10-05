import { useState } from 'react';
import { mensagemDeErro } from '../../api/client';
import { checkinsApi, usuariosApi } from '../../api/endpoints';
import type { Usuario } from '../../api/types';
import { Aviso, Botao, CampoBusca, Chip, Estado, ListaChips, Tabela, type Coluna } from '../../components/ui';
import { useCarregamento } from '../../hooks/useCarregamento';
import { useDebounce } from '../../hooks/useDebounce';
import { formatarDataHora, formatarTelefone } from '../../utils/formatacao';

function Saude({ u }: { u: Usuario }) {
  const itens = [
    u.restricaoAlimentar && <Chip key="r" cor="amarelo">Restrição: {u.restricaoAlimentar}</Chip>,
    u.alergia && <Chip key="a" cor="vermelho">Alergia: {u.alergia}</Chip>,
    u.medicamentoContinuo && <Chip key="m" cor="azul">Medicamento: {u.medicamentoContinuo}</Chip>,
    u.condicaoSaude && <Chip key="c" cor="vermelho">Saúde: {u.condicaoSaude}</Chip>,
  ].filter(Boolean);
  return itens.length ? <ListaChips>{itens}</ListaChips> : <span>—</span>;
}

export function Participantes() {
  const [busca, setBusca] = useState('');
  const termo = useDebounce(busca, 300);
  const { dados, erro, carregando } = useCarregamento(() => usuariosApi.buscar(termo), [termo]);
  const [aviso, setAviso] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  async function registrarEntrada(u: Usuario) {
    try {
      const c = await checkinsApi.registrarEntrada(u.id);
      setAviso({ tipo: 'sucesso', texto: `Entrada de ${c.usuarioNome} registrada às ${formatarDataHora(c.dataHora)}.` });
    } catch (e) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(e) });
    }
  }

  const colunas: Coluna<Usuario>[] = [
    { titulo: 'Nº', celula: (u) => u.id, numerica: true },
    { titulo: 'Nome', celula: (u) => <strong>{u.nome}</strong>, semQuebra: true },
    { titulo: 'Idade', celula: (u) => u.idade ?? '—', numerica: true },
    { titulo: 'Responsáveis', celula: (u) => u.responsaveis ?? '—' },
    { titulo: 'Contato', celula: (u) => formatarTelefone(u.telefoneResponsavel ?? u.telefone), semQuebra: true },
    { titulo: 'Igreja / Gap', celula: (u) => (
      <ListaChips>
        {u.frequentaIgreja && <Chip cor="verde">{u.igreja ?? 'Igreja'}</Chip>}
        {u.frequentaGap && <Chip cor="azul">Gap</Chip>}
        {!u.frequentaIgreja && !u.frequentaGap && '—'}
      </ListaChips>
    ) },
    { titulo: 'Saúde', celula: (u) => <Saude u={u} /> },
    { titulo: '', celula: (u) => <Botao variante="fantasma" onClick={() => registrarEntrada(u)}>Registrar entrada</Botao> },
  ];

  return (
    <>
      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      <CampoBusca rotulo="Buscar por nome ou número" valor={busca} onChange={setBusca} />
      <Estado carregando={carregando} erro={erro} dados={dados}>
        {(usuarios) => (
          <Tabela colunas={colunas} linhas={usuarios} chave={(u) => u.id} vazio="Nenhum participante encontrado." />
        )}
      </Estado>
    </>
  );
}
