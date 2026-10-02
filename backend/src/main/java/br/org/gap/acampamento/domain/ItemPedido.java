package br.org.gap.acampamento.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "itens_pedido",
       uniqueConstraints = @UniqueConstraint(name = "uq_item_pedido_produto",
                                             columnNames = {"pedido_id", "produto_id"}))
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id", nullable = false, updatable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "produto_id", nullable = false, updatable = false)
    private Produto produto;

    @Column(nullable = false, updatable = false)
    private int quantidade;

    /** Preço no momento da venda — o histórico não muda se o catálogo mudar. */
    @Column(name = "preco_unitario", nullable = false, precision = 10, scale = 2, updatable = false)
    private BigDecimal precoUnitario;

    protected ItemPedido() { }

    ItemPedido(Pedido pedido, Produto produto, int quantidade, BigDecimal precoUnitario) {
        this.pedido = pedido;
        this.produto = produto;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
    }

    public BigDecimal getSubtotal() {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public Long getId() { return id; }
    public Pedido getPedido() { return pedido; }
    public Produto getProduto() { return produto; }
    public int getQuantidade() { return quantidade; }
    public BigDecimal getPrecoUnitario() { return precoUnitario; }
}
