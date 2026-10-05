package br.gap.acampamento.repository;

import br.gap.acampamento.domain.Usuario;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    List<Usuario> findByNomeContainingIgnoreCaseOrderByIdAsc(String nome);

    List<Usuario> findAllByOrderByIdAsc();

    boolean existsByNomeIgnoreCase(String nome);
}
