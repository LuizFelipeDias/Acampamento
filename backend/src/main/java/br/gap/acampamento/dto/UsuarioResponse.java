package br.gap.acampamento.dto;

import br.gap.acampamento.domain.Usuario;
import java.time.OffsetDateTime;

public record UsuarioResponse(
        Long id,
        String nome,
        Integer idade,
        String telefone,
        String responsaveis,
        String telefoneResponsavel,
        boolean frequentaIgreja,
        String igreja,
        boolean frequentaGap,
        String restricaoAlimentar,
        String alergia,
        String medicamentoContinuo,
        String condicaoSaude,
        OffsetDateTime criadoEm) {

    public static UsuarioResponse from(Usuario u) {
        return new UsuarioResponse(
                u.getId(), u.getNome(), u.getIdade() == null ? null : u.getIdade().intValue(), u.getTelefone(), u.getResponsaveis(),
                u.getTelefoneResponsavel(), u.isFrequentaIgreja(), u.getIgreja(), u.isFrequentaGap(), u.getRestricaoAlimentar(),
                u.getAlergia(), u.getMedicamentoContinuo(), u.getCondicaoSaude(), u.getCriadoEm());
    }
}
