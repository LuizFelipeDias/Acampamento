CREATE TABLE usuarios (
    id                     BIGSERIAL PRIMARY KEY,
    nome                   VARCHAR(150) NOT NULL,
    idade                  SMALLINT     NOT NULL CHECK (idade BETWEEN 0 AND 120),
    telefone               VARCHAR(20),
    responsaveis           VARCHAR(255),
    frequenta_igreja       BOOLEAN      NOT NULL DEFAULT FALSE,
    frequenta_gap          BOOLEAN      NOT NULL DEFAULT FALSE,
    restricao_alimentar    VARCHAR(255),
    alergia                VARCHAR(255),
    medicamento_continuo   VARCHAR(255),
    criado_em              TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE checkins (
    id          BIGSERIAL PRIMARY KEY,
    usuario_id  BIGINT      NOT NULL REFERENCES usuarios(id),
    data_hora   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_checkins_usuario ON checkins(usuario_id);

CREATE TABLE produtos (
    id       BIGSERIAL PRIMARY KEY,
    nome     VARCHAR(120)  NOT NULL UNIQUE,
    preco    NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
    estoque  INTEGER       NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    ativo    BOOLEAN       NOT NULL DEFAULT TRUE,
    versao   BIGINT        NOT NULL DEFAULT 0
);

CREATE TABLE pedidos (
    id                BIGSERIAL PRIMARY KEY,
    usuario_id        BIGINT        NOT NULL REFERENCES usuarios(id),
    data_hora         TIMESTAMPTZ   NOT NULL DEFAULT now(),
    metodo_pagamento  VARCHAR(20)   NOT NULL
        CHECK (metodo_pagamento IN ('DINHEIRO','PIX','CARTAO_DEBITO','CARTAO_CREDITO','FIADO')),
    valor_total       NUMERIC(10,2) NOT NULL CHECK (valor_total >= 0)
);
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_data ON pedidos(data_hora);

CREATE TABLE itens_pedido (
    id              BIGSERIAL PRIMARY KEY,
    pedido_id       BIGINT        NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id      BIGINT        NOT NULL REFERENCES produtos(id),
    quantidade      INTEGER       NOT NULL CHECK (quantidade > 0),
    preco_unitario  NUMERIC(10,2) NOT NULL CHECK (preco_unitario >= 0),
    CONSTRAINT uq_item_pedido_produto UNIQUE (pedido_id, produto_id)
);
