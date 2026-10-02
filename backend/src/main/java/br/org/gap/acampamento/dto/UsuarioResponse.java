package br.org.gap.acampamento.dto;

import br.org.gap.acampamento.domain.Usuario;
import java.time.OffsetDateTime;

public record UsuarioResponse(
        Long id,
        String nome,
        int idade,
        String telefone,
        String responsaveis,
        String telefoneResponsavel,
        boolean frequentaIgreja,
        String igreja,
        boolean frequentaGap,
        String restricaoAlimentar,
        String alergia,
        String medicamentoContinuo,
        OffsetDateTime criadoEm) {

    public static UsuarioResponse from(Usuario u) {
        return new UsuarioResponse(
                u.getId(), u.getNome(), u.getIdade(), u.getTelefone(), u.getResponsaveis(),
                u.getTelefoneResponsavel(), u.isFrequentaIgreja(), u.getIgreja(), u.isFrequentaGap(), u.getRestricaoAlimentar(),
                u.getAlergia(), u.getMedicamentoContinuo(), u.getCriadoEm());
    }
}
