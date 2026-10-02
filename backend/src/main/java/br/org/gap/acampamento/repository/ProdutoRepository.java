package br.org.gap.acampamento.repository;

import br.org.gap.acampamento.domain.Produto;
import jakarta.persistence.LockModeType;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findAllByOrderByNomeAsc();

    List<Produto> findByAtivoTrueOrderByNomeAsc();

    boolean existsByNomeIgnoreCase(String nome);

    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);

    /**
     * Trava as linhas dos produtos durante a venda (SELECT ... FOR UPDATE).
     * A ordenação por id evita deadlock entre vendas simultâneas.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Produto p where p.id in :ids order by p.id")
    List<Produto> findAllByIdParaVenda(@Param("ids") Collection<Long> ids);
}
