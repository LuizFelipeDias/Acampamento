package br.org.gap.acampamento.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false)
    private Short idade;

    @Column(length = 20)
    private String telefone;

    private String responsaveis;

    @Column(name = "telefone_responsavel", length = 20)
    private String telefoneResponsavel;

    @Column(length = 120)
    private String igreja;

    @Column(name = "frequenta_igreja", nullable = false)
    private boolean frequentaIgreja;

    @Column(name = "frequenta_gap", nullable = false)
    private boolean frequentaGap;

    /** Null = sem restrição. Texto livre descreve a restrição. */
    @Column(name = "restricao_alimentar")
    private String restricaoAlimentar;

    @Column(name = "alergia")
    private String alergia;

    @Column(name = "medicamento_continuo")
    private String medicamentoContinuo;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    protected Usuario() { }

    public Usuario(String nome, Short idade) {
        this.nome = nome;
        this.idade = idade;
    }

    @PrePersist
    void prePersist() {
        if (criadoEm == null) criadoEm = OffsetDateTime.now();
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Short getIdade() { return idade; }
    public void setIdade(Short idade) { this.idade = idade; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getResponsaveis() { return responsaveis; }
    public void setResponsaveis(String responsaveis) { this.responsaveis = responsaveis; }
    public String getTelefoneResponsavel() { return telefoneResponsavel; }
    public void setTelefoneResponsavel(String v) { this.telefoneResponsavel = v; }
    public String getIgreja() { return igreja; }
    public void setIgreja(String igreja) { this.igreja = igreja; }
    public boolean isFrequentaIgreja() { return frequentaIgreja; }
    public void setFrequentaIgreja(boolean v) { this.frequentaIgreja = v; }
    public boolean isFrequentaGap() { return frequentaGap; }
    public void setFrequentaGap(boolean v) { this.frequentaGap = v; }
    public String getRestricaoAlimentar() { return restricaoAlimentar; }
    public void setRestricaoAlimentar(String v) { this.restricaoAlimentar = v; }
    public String getAlergia() { return alergia; }
    public void setAlergia(String alergia) { this.alergia = alergia; }
    public String getMedicamentoContinuo() { return medicamentoContinuo; }
    public void setMedicamentoContinuo(String v) { this.medicamentoContinuo = v; }
    public OffsetDateTime getCriadoEm() { return criadoEm; }
}
