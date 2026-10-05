package br.gap.acampamento.service;

import br.gap.acampamento.domain.Pedido;
import br.gap.acampamento.domain.Produto;
import br.gap.acampamento.domain.Usuario;
import br.gap.acampamento.dto.PedidoRequest;
import br.gap.acampamento.dto.PedidoResponse;
import br.gap.acampamento.repository.PedidoRepository;
import br.gap.acampamento.repository.ProdutoRepository;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PedidoService {

    private final PedidoRepository pedidos;
    private final ProdutoRepository produtos;
    private final UsuarioService usuarioService;

    public PedidoService(PedidoRepository pedidos, ProdutoRepository produtos, UsuarioService usuarioService) {
        this.pedidos = pedidos;
        this.produtos = produtos;
        this.usuarioService = usuarioService;
    }

    /**
     * Registra a compra de forma atômica: trava os produtos, baixa estoque,
     * congela o preço de cada item e grava o pedido. Qualquer falha desfaz tudo.
     */
    @Transactional
    public PedidoResponse criar(PedidoRequest req) {
        Usuario usuario = usuarioService.obter(req.usuarioId());

        // O mesmo produto adicionado duas vezes no carrinho vira um único item.
        Map<Long, Integer> quantidadePorProduto = req.itens().stream()
                .collect(Collectors.toMap(PedidoRequest.Item::produtoId, PedidoRequest.Item::quantidade,
                        Integer::sum, TreeMap::new));

        Map<Long, Produto> encontrados = produtos.findAllByIdParaVenda(quantidadePorProduto.keySet()).stream()
                .collect(Collectors.toMap(Produto::getId, p -> p));

        Pedido pedido = new Pedido(usuario, req.metodoPagamento());
        quantidadePorProduto.forEach((produtoId, quantidade) -> {
            Produto produto = encontrados.get(produtoId);
            if (produto == null) {
                throw new RecursoNaoEncontradoException("Produto", produtoId);
            }
            pedido.adicionarItem(produto, quantidade);
        });

        return PedidoResponse.from(pedidos.save(pedido));
    }

    public PedidoResponse buscarPorId(Long id) {
        return pedidos.findWithItensById(id)
                .map(PedidoResponse::from)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido", id));
    }

    public List<PedidoResponse> listar(Long usuarioId) {
        List<Pedido> lista = (usuarioId == null)
                ? pedidos.findAllByOrderByDataHoraDesc()
                : pedidos.findByUsuarioIdOrderByDataHoraDesc(usuarioId);
        return lista.stream().map(PedidoResponse::from).toList();
    }
}
