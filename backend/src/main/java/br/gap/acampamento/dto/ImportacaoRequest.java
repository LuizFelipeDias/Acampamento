package br.gap.acampamento.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.List;

public record ImportacaoRequest(@NotEmpty List<@Valid Item> participantes) {

    /** inscritoEm é opcional: preserva a data da inscrição original. */
    public record Item(OffsetDateTime inscritoEm, @NotNull @Valid UsuarioRequest participante) {
    }
}
