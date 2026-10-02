package br.org.gap.acampamento.dto;

import br.org.gap.acampamento.domain.Checkin;
import java.time.OffsetDateTime;

public record CheckinResponse(Long id, Long usuarioId, String usuarioNome, OffsetDateTime dataHora) {

    public static CheckinResponse from(Checkin c) {
        return new CheckinResponse(c.getId(), c.getUsuario().getId(), c.getUsuario().getNome(), c.getDataHora());
    }
}
