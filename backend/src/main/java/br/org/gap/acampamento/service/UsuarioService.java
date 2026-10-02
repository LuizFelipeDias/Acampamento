package br.org.gap.acampamento.service;

import br.org.gap.acampamento.domain.Usuario;
import br.org.gap.acampamento.dto.UsuarioRequest;
import br.org.gap.acampamento.dto.UsuarioResponse;
import br.org.gap.acampamento.repository.UsuarioRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UsuarioService {

    private final UsuarioRepository usuarios;

    public UsuarioService(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    /** Busca por número (id) quando o termo é numérico; senão, por trecho do nome. */
    public List<UsuarioResponse> buscar(String termo) {
        if (termo == null || termo.isBlank()) {
            return usuarios.findAllByOrderByNomeAsc().stream().map(UsuarioResponse::from).toList();
        }
        String t = termo.trim();
        if (t.chars().allMatch(Character::isDigit)) {
            return usuarios.findById(Long.valueOf(t)).map(UsuarioResponse::from).stream().toList();
        }
        return usuarios.findByNomeContainingIgnoreCaseOrderByNomeAsc(t).stream()
                .map(UsuarioResponse::from).toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        return UsuarioResponse.from(obter(id));
    }

    @Transactional
    public UsuarioResponse atualizar(Long id, UsuarioRequest req) {
        Usuario u = obter(id);
        aplicar(req, u);
        return UsuarioResponse.from(u);
    }

    Usuario obter(Long id) {
        return usuarios.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Usuário", id));
    }

    @Transactional
    Usuario criar(UsuarioRequest req) {
        Usuario u = new Usuario(req.nome().trim(), req.idade().shortValue());
        aplicar(req, u);
        return usuarios.save(u);
    }

    private static void aplicar(UsuarioRequest req, Usuario u) {
        u.setNome(req.nome().trim());
        u.setIdade(req.idade().shortValue());
        u.setTelefone(textoOuNulo(req.telefone()));
        u.setResponsaveis(textoOuNulo(req.responsaveis()));
        u.setFrequentaIgreja(req.frequentaIgreja());
        u.setFrequentaGap(req.frequentaGap());
        u.setRestricaoAlimentar(textoOuNulo(req.restricaoAlimentar()));
        u.setAlergia(textoOuNulo(req.alergia()));
        u.setMedicamentoContinuo(textoOuNulo(req.medicamentoContinuo()));
    }

    /** Campo em branco é gravado como NULL ("não tem"). */
    private static String textoOuNulo(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
