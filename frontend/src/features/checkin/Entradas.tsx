import { checkinsApi } from '../../api/endpoints';
import type { Checkin } from '../../api/types';
import { Estado, Tabela, type Coluna } from '../../components/ui';
import { useCarregamento } from '../../hooks/useCarregamento';
import { formatarDataHora } from '../../utils/formatacao';

const colunas: Coluna<Checkin>[] = [
  { titulo: 'Data e hora', celula: (c) => formatarDataHora(c.dataHora), semQuebra: true },
  { titulo: 'Nº', celula: (c) => c.usuarioId, numerica: true },
  { titulo: 'Participante', celula: (c) => c.usuarioNome },
];

export function Entradas() {
  const { dados, erro, carregando } = useCarregamento(() => checkinsApi.listar());
  return (
    <Estado carregando={carregando} erro={erro} dados={dados}>
      {(lista) => <Tabela colunas={colunas} linhas={lista} chave={(c) => c.id} vazio="Nenhuma entrada registrada." />}
    </Estado>
  );
}
