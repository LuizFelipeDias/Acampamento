package br.org.gap.acampamento.web;

import br.org.gap.acampamento.dto.UsuarioRequest;
import br.org.gap.acampamento.dto.UsuarioResponse;
import br.org.gap.acampamento.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    /** ?busca=Maria (por nome) ou ?busca=42 (por número). Sem parâmetro, lista todos. */
    @GetMapping
    public List<UsuarioResponse> buscar(@RequestParam(required = false) String busca) {
        return service.buscar(busca);
    }

    @GetMapping("/{id}")
    public UsuarioResponse buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public UsuarioResponse atualizar(@PathVariable Long id, @Valid @RequestBody UsuarioRequest req) {
        return service.atualizar(id, req);
    }
}
