package br.gap.acampamento.repository;

import br.gap.acampamento.domain.Checkin;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckinRepository extends JpaRepository<Checkin, Long> {

    @EntityGraph(attributePaths = "usuario")
    List<Checkin> findAllByOrderByDataHoraDesc();

    @EntityGraph(attributePaths = "usuario")
    List<Checkin> findByUsuarioIdOrderByDataHoraDesc(Long usuarioId);
}
