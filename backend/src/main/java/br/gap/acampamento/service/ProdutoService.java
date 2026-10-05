package br.gap.acampamento.service;

import br.gap.acampamento.domain.Produto;
import br.gap.acampamento.domain.RegraNegocioException;
import br.gap.acampamento.dto.ProdutoRequest;
import br.gap.acampamento.dto.ProdutoResponse;
import br.gap.acampamento.repository.ProdutoRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProdutoService {

    private final ProdutoRepository produtos;

    public ProdutoService(ProdutoRepository produtos) {
        this.produtos = produtos;
    }

    public List<ProdutoResponse> listar(boolean somenteAtivos) {
        List<Produto> lista = somenteAtivos
                ? produtos.findByAtivoTrueOrderByNomeAsc()
                : produtos.findAllByOrderByNomeAsc();
        return lista.stream().map(ProdutoResponse::from).toList();
    }

    public ProdutoResponse buscarPorId(Long id) {
        return ProdutoResponse.from(obter(id));
    }

    @Transactional
    public ProdutoResponse criar(ProdutoRequest req) {
        String nome = req.nome().trim();
        if (produtos.existsByNomeIgnoreCase(nome)) {
            throw new RegraNegocioException("Já existe produto com o nome " + nome);
        }
        return ProdutoResponse.from(produtos.save(new Produto(nome, req.preco(), req.estoque())));
    }

    @Transactional
    public ProdutoResponse atualizar(Long id, ProdutoRequest req) {
        Produto p = obter(id);
        String nome = req.nome().trim();
        if (produtos.existsByNomeIgnoreCaseAndIdNot(nome, id)) {
            throw new RegraNegocioException("Já existe produto com o nome " + nome);
        }
        p.setNome(nome);
        p.setPreco(req.preco());
        p.setEstoque(req.estoque());
        return ProdutoResponse.from(p);
    }

    /** Não apaga: desativa, para preservar o histórico de pedidos. */
    @Transactional
    public void desativar(Long id) {
        obter(id).setAtivo(false);
    }

    @Transactional
    public ProdutoResponse reativar(Long id) {
        Produto p = obter(id);
        p.setAtivo(true);
        return ProdutoResponse.from(p);
    }

    private Produto obter(Long id) {
        return produtos.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Produto", id));
    }
}
