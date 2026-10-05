package br.gap.acampamento.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotBlank @Size(max = 150) String nome,
        @Min(0) @Max(120) Integer idade,
        @Size(max = 20) String telefone,
        @Size(max = 255) String responsaveis,
        @Size(max = 20) String telefoneResponsavel,
        boolean frequentaIgreja,
        @Size(max = 120) String igreja,
        boolean frequentaGap,
        @Size(max = 255) String restricaoAlimentar,
        @Size(max = 255) String alergia,
        @Size(max = 255) String medicamentoContinuo,
        @Size(max = 255) String condicaoSaude) {
}
