# Acampamento Gap — Check-in e Cantina

Sistema web para o check-in dos participantes e a cantina do acampamento.

| Camada | Tecnologia | Pasta |
|---|---|---|
| API | Java 21 + Spring Boot 3.5 (JPA, Flyway) | `backend/` |
| Interface | React 19 + TypeScript + Vite | `frontend/` |
| Banco | PostgreSQL 16 | `docker-compose.yml` |

## Estrutura

```
.devcontainer/          ambiente do Codespaces (Java, Node, Postgres)
backend/
  src/main/java/.../
    config/             CORS e configurações web
    domain/             entidades JPA e regras de negócio
    dto/                contratos de entrada/saída da API
    repository/         acesso a dados (Spring Data)
    service/            casos de uso e transações
    web/                controllers REST e tratamento de erros
  src/main/resources/
    db/migration/       migrações Flyway (V1, V2, ...)
frontend/src/
  api/                  cliente HTTP, endpoints e tipos
  components/           layout e componentes de interface reutilizáveis
  features/             telas por área (home, checkin, cantina)
  hooks/  utils/  styles/
docs/api.http           requisições de exemplo
dados-privados/         dados pessoais (fora do Git)
```

## Rodar no Codespaces

```bash
# terminal 1 — API em http://localhost:8080
cd backend && mvn spring-boot:run

# terminal 2 — interface em http://localhost:5173
cd frontend && npm ci && npm run dev
```

## Rodar localmente

Instale JDK 21, Maven, Node 22 e Docker. Copie `.env.example` para `.env`, suba o banco com
`docker compose up -d db` e rode os dois comandos acima. Nenhum código muda: a conexão vem das
variáveis `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD`.

## Importar inscrições

Com a API rodando, a partir da raiz do repositório:

```bash
curl -s -X POST http://localhost:8080/api/usuarios/importacao \
  -H 'Content-Type: application/json' \
  --data @dados-privados/participantes-2026.json
```

A importação é idempotente: participantes com o mesmo nome já cadastrado são ignorados.
