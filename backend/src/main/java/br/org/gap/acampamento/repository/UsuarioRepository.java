package br.org.gap.acampamento.repository;

import br.org.gap.acampamento.domain.Usuario;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    List<Usuario> findByNomeContainingIgnoreCaseOrderByNomeAsc(String nome);

    List<Usuario> findAllByOrderByNomeAsc();

    boolean existsByNomeIgnoreCase(String nome);
}
