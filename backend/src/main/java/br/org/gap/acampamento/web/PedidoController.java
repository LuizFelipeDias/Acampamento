package br.org.gap.acampamento.web;

import br.org.gap.acampamento.dto.PedidoRequest;
import br.org.gap.acampamento.dto.PedidoResponse;
import br.org.gap.acampamento.service.PedidoService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    /** Tela de pagamento → "Pagar". */
    @PostMapping
    public ResponseEntity<PedidoResponse> criar(@Valid @RequestBody PedidoRequest req) {
        PedidoResponse resp = service.criar(req);
        return ResponseEntity.created(URI.create("/api/pedidos/" + resp.id())).body(resp);
    }

    @GetMapping("/{id}")
    public PedidoResponse buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    /** Histórico de compras; ?usuarioId=42 filtra por participante. */
    @GetMapping
    public List<PedidoResponse> listar(@RequestParam(required = false) Long usuarioId) {
        return service.listar(usuarioId);
    }
}
