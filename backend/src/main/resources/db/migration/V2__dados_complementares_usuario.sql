-- Campos do formulário de Check-in: telefone do responsável e qual igreja frequenta.
ALTER TABLE usuarios
    ADD COLUMN telefone_responsavel VARCHAR(20),
    ADD COLUMN igreja               VARCHAR(120);
