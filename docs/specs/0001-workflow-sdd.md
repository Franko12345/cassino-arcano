# Spec: Workflow SDD

- **Issue:** #1
- **Status:** Implementada
- **Data:** 2026-08-04

## Contexto

O projeto cresceu em escopo e decisões. Issues sem contexto, ADRs em comentários, mudanças de balanceamento sem rastro e fluxo de PR ad-hoc estavam tornando a colaboração mais cara. Era hora de formalizar o que era prática.

## Glossário

Termos atualizados em `CONTEXT.md`:

- **Ato** — único conceito. Antes usado alternadamente com "Contrato" na UI. Agora unificado.
- **Talismã** — único conceito. Catálogo interno é um array de configuração, não um domínio paralelo.
- **Expedição** — sequência completa de cinco atos.
- **Vida** — recurso de continuidade.
- **Saldo** — quantidade de fichas virtuais.
- **Aposta** — fichas comprometidas em uma rodada.
- **Recompensa** — saldo creditado por resultado.
- **Loja** — modal entre atos.
- **Catálogo de Talismãs** — conjunto estático por jogo.
- **Blackjack** e **Roleta** — jogos base.
- **Rodada** — unidade mínima de aposta.
- **Mesa** — superfície virtual.
- **Jogador** e **Casa** — papéis.
- **Quebra de resultado** — sequência visível de base → modificadores → total.
- **Sound toggle** — controle de áudio procedural.
- **Reduced motion** — modo de acessibilidade.

## Decisões arquiteturais

- `docs/adr/0001-stack-vanilla-html-css-js.md` — HTML/CSS/JS nativo sem framework.
- `docs/adr/0002-apenas-dinheiro-virtual.md` — sem compra, sem saque, sem mercado.

## Mudanças visíveis

- `CONTEXT.md` agora é só glossário. Regras de implementação, balanceamento e verificação foram removidas.
- `docs/workflow.md` define o fluxo SDD: issue → spec → branch → commits → PR → review → merge.
- `docs/adr/` armazena decisões arquiteturais com templates numerados.
- `docs/specs/` armazena especificações com template.
- `.github/ISSUE_TEMPLATE/` traz templates para `spec`, `bug`, `chore`, `setup`.
- `.github/PULL_REQUEST_TEMPLATE.md` referencia a issue e a spec.
- `scripts/new-spec.sh` e `scripts/new-adr.sh` criam arquivos a partir dos templates.
- `scripts/new-issue.sh` abre issues via `gh`.
- `CODEOWNERS` define Franko12345 como aprovador padrão.

## Critérios de aceitação

- [x] `CONTEXT.md` contém apenas glossário canônico.
- [x] `docs/adr/` tem pelo menos duas decisões iniciais.
- [x] `docs/specs/` tem pelo menos uma spec de exemplo (`0001-workflow-sdd.md`).
- [x] `docs/workflow.md` descreve o fluxo completo.
- [x] `.github/ISSUE_TEMPLATE/` tem templates para os quatro tipos.
- [x] `.github/PULL_REQUEST_TEMPLATE.md` referencia issue e spec.
- [x] `scripts/` tem utilitários para criar spec, ADR e issue.
- [x] `CODEOWNERS` declara Franko12345.
- [x] `scripts/check_site.py` continua passando.
- [x] CI verde após o PR.

## Plano de verificação

- `python3 scripts/check_site.py` — checa páginas e referências.
- `gh workflow run pages.yml` ou push para `main` — CI roda `check_site.py` e deploy.
- Inspeção visual de `docs/workflow.md` e `docs/adr/0001-stack-vanilla-html-css-js.md`.
- Execução de `scripts/new-spec.sh exemplo` cria `docs/specs/exemplo.md`.

## Fora de escopo

- Migração para Svelte, Phaser ou qualquer framework.
- Refatoração de `index.html`, `shared.js`, `blackjack/index.html` ou `roulette/index.html`.
- Mudança de regras de balanceamento.
- Backend ou persistência de run.

## Notas

A primeira issue deste projeto (workflow SDD) é a #1. Issues futuras começam em #2. A escolha de começar com #1 estabelece o tracker limpo.

O glossário unificou "Ato/Contrato" no termo "Ato" para evitar fork de vocabulário entre UI e código. Texto de UI antes falava de "Contrato" e código de `state.act`. Agora ambos usam "Ato". O texto da UI de "Novo contrato" foi substituído por "Novo ato" — ver `checkAct` em ambos os jogos.
