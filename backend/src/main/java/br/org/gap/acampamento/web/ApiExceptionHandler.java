package br.org.gap.acampamento.web;

import br.org.gap.acampamento.domain.RegraNegocioException;
import br.org.gap.acampamento.service.RecursoNaoEncontradoException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/** Todas as respostas de erro seguem o padrão RFC 9457 (application/problem+json). */
@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    ProblemDetail naoEncontrado(RecursoNaoEncontradoException ex) {
        return problema(HttpStatus.NOT_FOUND, "Recurso não encontrado", ex.getMessage());
    }

    @ExceptionHandler(RegraNegocioException.class)
    ProblemDetail regraNegocio(RegraNegocioException ex) {
        return problema(HttpStatus.CONFLICT, "Regra de negócio violada", ex.getMessage());
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    ProblemDetail concorrencia(OptimisticLockingFailureException ex) {
        return problema(HttpStatus.CONFLICT, "Conflito de atualização",
                "O registro foi alterado por outra operação. Recarregue e tente novamente.");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ProblemDetail integridade(DataIntegrityViolationException ex) {
        return problema(HttpStatus.CONFLICT, "Violação de integridade",
                "A operação viola uma restrição do banco de dados.");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ProblemDetail argumentoInvalido(IllegalArgumentException ex) {
        return problema(HttpStatus.BAD_REQUEST, "Requisição inválida", ex.getMessage());
    }

    /** Erros de @Valid: devolve um mapa campo → mensagem para o formulário exibir. */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        Map<String, String> erros = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> erros.putIfAbsent(e.getField(), e.getDefaultMessage()));
        ProblemDetail pd = problema(HttpStatus.BAD_REQUEST, "Dados inválidos", "Verifique os campos destacados.");
        pd.setProperty("erros", erros);
        return ResponseEntity.badRequest().body(pd);
    }

    private static ProblemDetail problema(HttpStatus status, String titulo, String detalhe) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detalhe);
        pd.setTitle(titulo);
        return pd;
    }
}
