package br.gap.acampamento.repository;

import br.gap.acampamento.domain.Pedido;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @EntityGraph(attributePaths = {"usuario", "itens", "itens.produto"})
    List<Pedido> findAllByOrderByDataHoraDesc();

    @EntityGraph(attributePaths = {"usuario", "itens", "itens.produto"})
    List<Pedido> findByUsuarioIdOrderByDataHoraDesc(Long usuarioId);

    @EntityGraph(attributePaths = {"usuario", "itens", "itens.produto"})
    Optional<Pedido> findWithItensById(Long id);
}
