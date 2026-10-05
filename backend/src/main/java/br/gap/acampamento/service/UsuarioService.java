package br.gap.acampamento.service;

import br.gap.acampamento.domain.Usuario;
import br.gap.acampamento.dto.ImportacaoRequest;
import br.gap.acampamento.dto.ImportacaoResponse;
import br.gap.acampamento.dto.UsuarioRequest;
import br.gap.acampamento.dto.UsuarioResponse;
import br.gap.acampamento.repository.UsuarioRepository;
import java.util.ArrayList;
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

    /**
     * Cadastra participantes em lote (ex.: inscrições do formulário).
     * Idempotente: quem já existe com o mesmo nome é ignorado, então o arquivo pode ser reenviado.
     */
    @Transactional
    public ImportacaoResponse importar(ImportacaoRequest req) {
        List<String> importados = new ArrayList<>();
        List<String> ignorados = new ArrayList<>();
        for (ImportacaoRequest.Item item : req.participantes()) {
            String nome = item.participante().nome().trim();
            if (usuarios.existsByNomeIgnoreCase(nome)) {
                ignorados.add(nome);
                continue;
            }
            Usuario u = novo(item.participante());
            if (item.inscritoEm() != null) {
                u.setCriadoEm(item.inscritoEm());
            }
            usuarios.save(u);
            importados.add(nome);
        }
        return new ImportacaoResponse(importados.size(), importados, ignorados);
    }

    Usuario obter(Long id) {
        return usuarios.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Usuário", id));
    }

    @Transactional
    Usuario criar(UsuarioRequest req) {
        return usuarios.save(novo(req));
    }

    private static Usuario novo(UsuarioRequest req) {
        Usuario u = new Usuario(req.nome().trim(), idade(req));
        aplicar(req, u);
        return u;
    }

    private static void aplicar(UsuarioRequest req, Usuario u) {
        u.setNome(req.nome().trim());
        u.setIdade(idade(req));
        u.setTelefone(textoOuNulo(req.telefone()));
        u.setResponsaveis(textoOuNulo(req.responsaveis()));
        u.setTelefoneResponsavel(textoOuNulo(req.telefoneResponsavel()));
        u.setFrequentaIgreja(req.frequentaIgreja());
        // "Qual igreja" só faz sentido se frequenta.
        u.setIgreja(req.frequentaIgreja() ? textoOuNulo(req.igreja()) : null);
        u.setFrequentaGap(req.frequentaGap());
        u.setRestricaoAlimentar(textoOuNulo(req.restricaoAlimentar()));
        u.setAlergia(textoOuNulo(req.alergia()));
        u.setMedicamentoContinuo(textoOuNulo(req.medicamentoContinuo()));
        u.setCondicaoSaude(textoOuNulo(req.condicaoSaude()));
    }

    private static Short idade(UsuarioRequest req) {
        return req.idade() == null ? null : req.idade().shortValue();
    }

    /** Campo em branco é gravado como NULL ("não tem"). */
    private static String textoOuNulo(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
