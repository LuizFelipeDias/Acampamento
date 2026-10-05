package br.gap.acampamento.service;

import br.gap.acampamento.domain.Checkin;
import br.gap.acampamento.domain.Usuario;
import br.gap.acampamento.dto.CheckinResponse;
import br.gap.acampamento.dto.UsuarioRequest;
import br.gap.acampamento.repository.CheckinRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CheckinService {

    private final CheckinRepository checkins;
    private final UsuarioService usuarioService;

    public CheckinService(CheckinRepository checkins, UsuarioService usuarioService) {
        this.checkins = checkins;
        this.usuarioService = usuarioService;
    }

    /** Tela "Register": cadastra o participante e registra a entrada na mesma transação. */
    @Transactional
    public CheckinResponse registrarNovoParticipante(UsuarioRequest req) {
        Usuario usuario = usuarioService.criar(req);
        return CheckinResponse.from(checkins.save(new Checkin(usuario)));
    }

    /** Nova entrada de um participante já cadastrado. */
    @Transactional
    public CheckinResponse registrarEntrada(Long usuarioId) {
        Usuario usuario = usuarioService.obter(usuarioId);
        return CheckinResponse.from(checkins.save(new Checkin(usuario)));
    }

    public List<CheckinResponse> listar(Long usuarioId) {
        List<Checkin> lista = (usuarioId == null)
                ? checkins.findAllByOrderByDataHoraDesc()
                : checkins.findByUsuarioIdOrderByDataHoraDesc(usuarioId);
        return lista.stream().map(CheckinResponse::from).toList();
    }
}
