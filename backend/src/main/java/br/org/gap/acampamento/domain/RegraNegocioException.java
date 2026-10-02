package br.org.gap.acampamento.domain;

/** Violação de regra de negócio (ex.: estoque insuficiente). Mapeada para HTTP 409. */
public class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
