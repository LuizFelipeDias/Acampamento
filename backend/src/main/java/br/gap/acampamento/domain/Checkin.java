package br.gap.acampamento.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "checkins")
public class Checkin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "data_hora", nullable = false, updatable = false)
    private OffsetDateTime dataHora;

    protected Checkin() { }

    public Checkin(Usuario usuario) {
        this.usuario = usuario;
        this.dataHora = OffsetDateTime.now();
    }

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public OffsetDateTime getDataHora() { return dataHora; }
}
