package br.org.gap.acampamento.dto;

import java.util.List;

public record ImportacaoResponse(int totalImportados, List<String> importados, List<String> ignoradosPorJaExistirem) {
}
