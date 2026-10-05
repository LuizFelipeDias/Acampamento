-- Líderes e adultos se inscrevem sem idade ("Outro." no formulário).
ALTER TABLE usuarios ALTER COLUMN idade DROP NOT NULL;

-- Pergunta do formulário: "Possui alguma condição de saúde que a liderança precisa conhecer?"
ALTER TABLE usuarios ADD COLUMN condicao_saude VARCHAR(255);
