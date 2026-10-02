package br.org.gap.acampamento.service;

/** Mapeada para HTTP 404. */
public class RecursoNaoEncontradoException extends RuntimeException {
    public RecursoNaoEncontradoException(String recurso, Object id) {
        super(recurso + " não encontrado: " + id);
    }
}
