package br.org.gap.acampamento.dto;

import br.org.gap.acampamento.domain.ItemPedido;
import br.org.gap.acampamento.domain.MetodoPagamento;
import br.org.gap.acampamento.domain.Pedido;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        Long usuarioId,
        String usuarioNome,
        OffsetDateTime dataHora,
        MetodoPagamento metodoPagamento,
        BigDecimal valorTotal,
        List<Item> itens) {

    public record Item(Long produtoId, String produtoNome, int quantidade,
                       BigDecimal precoUnitario, BigDecimal subtotal) {

        static Item from(ItemPedido i) {
            return new Item(i.getProduto().getId(), i.getProduto().getNome(), i.getQuantidade(),
                    i.getPrecoUnitario(), i.getSubtotal());
        }
    }

    public static PedidoResponse from(Pedido p) {
        return new PedidoResponse(
                p.getId(), p.getUsuario().getId(), p.getUsuario().getNome(), p.getDataHora(),
                p.getMetodoPagamento(), p.getValorTotal(),
                p.getItens().stream().map(Item::from).toList());
    }
}
