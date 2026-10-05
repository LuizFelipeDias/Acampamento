package br.gap.acampamento.dto;

import br.gap.acampamento.domain.Produto;
import java.math.BigDecimal;

public record ProdutoResponse(Long id, String nome, BigDecimal preco, int estoque, boolean ativo) {

    public static ProdutoResponse from(Produto p) {
        return new ProdutoResponse(p.getId(), p.getNome(), p.getPreco(), p.getEstoque(), p.isAtivo());
    }
}
