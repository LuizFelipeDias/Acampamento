package br.gap.acampamento.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, updatable = false)
    private Usuario usuario;

    @Column(name = "data_hora", nullable = false, updatable = false)
    private OffsetDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pagamento", nullable = false, length = 20, updatable = false)
    private MetodoPagamento metodoPagamento;

    @Column(name = "valor_total", nullable = false, precision = 10, scale = 2, updatable = false)
    private BigDecimal valorTotal = BigDecimal.ZERO;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();

    protected Pedido() { }

    public Pedido(Usuario usuario, MetodoPagamento metodoPagamento) {
        this.usuario = usuario;
        this.metodoPagamento = metodoPagamento;
        this.dataHora = OffsetDateTime.now();
    }

    /** Único ponto de entrada de itens: baixa estoque, congela preço e recalcula o total. */
    public void adicionarItem(Produto produto, int quantidade) {
        produto.baixarEstoque(quantidade);
        itens.add(new ItemPedido(this, produto, quantidade, produto.getPreco()));
        recalcularTotal();
    }

    private void recalcularTotal() {
        this.valorTotal = itens.stream()
                .map(ItemPedido::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public OffsetDateTime getDataHora() { return dataHora; }
    public MetodoPagamento getMetodoPagamento() { return metodoPagamento; }
    public BigDecimal getValorTotal() { return valorTotal; }
    public List<ItemPedido> getItens() { return Collections.unmodifiableList(itens); }
}
