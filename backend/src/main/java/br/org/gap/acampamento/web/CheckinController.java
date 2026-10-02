package br.org.gap.acampamento.web;

import br.org.gap.acampamento.dto.CheckinResponse;
import br.org.gap.acampamento.dto.UsuarioRequest;
import br.org.gap.acampamento.service.CheckinService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkins")
public class CheckinController {

    private final CheckinService service;

    public CheckinController(CheckinService service) {
        this.service = service;
    }

    /** Cadastro + entrada de um participante novo (tela Check-in → "Register"). */
    @PostMapping
    public ResponseEntity<CheckinResponse> registrarNovo(@Valid @RequestBody UsuarioRequest req) {
        CheckinResponse resp = service.registrarNovoParticipante(req);
        return ResponseEntity.created(URI.create("/api/usuarios/" + resp.usuarioId())).body(resp);
    }

    /** Nova entrada de participante já cadastrado. */
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<CheckinResponse> registrarEntrada(@PathVariable Long usuarioId) {
        CheckinResponse resp = service.registrarEntrada(usuarioId);
        return ResponseEntity.status(201).body(resp);
    }

    @GetMapping
    public List<CheckinResponse> listar(@RequestParam(required = false) Long usuarioId) {
        return service.listar(usuarioId);
    }
}
