package br.gap.acampamento.web;

import br.gap.acampamento.dto.ProdutoRequest;
import br.gap.acampamento.dto.ProdutoResponse;
import br.gap.acampamento.service.ProdutoService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    /** Por padrão só os ativos (catálogo da cantina). ?somenteAtivos=false lista todos. */
    @GetMapping
    public List<ProdutoResponse> listar(@RequestParam(defaultValue = "true") boolean somenteAtivos) {
        return service.listar(somenteAtivos);
    }

    @GetMapping("/{id}")
    public ProdutoResponse buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<ProdutoResponse> criar(@Valid @RequestBody ProdutoRequest req) {
        ProdutoResponse resp = service.criar(req);
        return ResponseEntity.created(URI.create("/api/produtos/" + resp.id())).body(resp);
    }

    @PutMapping("/{id}")
    public ProdutoResponse atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoRequest req) {
        return service.atualizar(id, req);
    }

    /** Desativa (não apaga) para preservar o histórico. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        service.desativar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reativar")
    public ProdutoResponse reativar(@PathVariable Long id) {
        return service.reativar(id);
    }
}
