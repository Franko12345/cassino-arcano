# Workflow SDD

> Spec-driven development para o Cassino Arcano. Use este workflow para qualquer mudança não trivial: nova feature, ajuste de balanceamento, refatoração de fluxo.

## Princípios

1. **Glossário antes do código.** Termos do `CONTEXT.md` são a fonte de verdade do vocabulário. Termo novo no código exige entrada no glossário.
2. **Issue antes da branch.** Toda mudança significativa vira issue. Branch se materializa depois.
3. **Spec antes do código.** Issues que afetam mecânica, balanceamento ou UX ganham uma `spec` em `docs/specs/`. Spec é revisada antes de implementação.
4. **PR é contrato.** A descrição do PR cita a issue e referencia a spec. Mudanças de escopo no PR reabrem a spec.
5. **Sem comentários órfãos.** Estado, balanceamento e regras não vivem em comentários de código. Vivem na spec ou no glossário.

## Fluxo

```
issue → spec → branch → commits → PR → review → merge → spec atualizada
```

### 1. Issue

Toda mudança não trivial começa como issue. Use o template `.github/ISSUE_TEMPLATE/spec.md`. Classificação:

- `type: spec` — exige `docs/specs/<slug>.md`
- `type: bug` — bug, sem spec, com passos de reprodução
- `type: chore` — refatoração, infra, manutenção

### 2. Spec

Issues de tipo `spec` produzem arquivo em `docs/specs/`. Veja template `.github/ISSUE_TEMPLATE/spec.md`. Spec inclui:

- problema e motivação
- critérios de aceitação
- mudanças visíveis no `CONTEXT.md` (se houver termos novos)
- ADRs novas ou alteradas
- plano de verificação

Spec é revisada no PR antes de ser aprovada. PR com spec ainda em revisão não pode ser mergeado.

### 3. Branch

Convenção: `feat/<issue-number>-<slug-curto>` ou `fix/<issue-number>-<slug-curto>`. Exemplo: `feat/12-talisman-tide-mesa`.

### 4. Commits

Conventional Commits em português ou inglês, qualquer um serve. Mensagem inclui `Refs #N` ou `Closes #N`.

### 5. PR

Use template `.github/PULL_REQUEST_TEMPLATE.md`. A descrição cita a issue e referencia a spec pelo caminho. Marque o checklist:

- [ ] spec revisada (se aplicável)
- [ ] `CONTEXT.md` atualizado (se termos novos)
- [ ] `docs/adr/` atualizado (se decisão nova)
- [ ] verificação executada (ver `docs/specs/` ou ADR)

### 6. Review

Cada PR precisa de:

- CI verde (`check_site.py` e `pages.yml`)
- Self-review do autor antes de pedir
- Aprovação do CODEOWNER (Franko12345)

### 7. Merge

Merge via squash. Branch deletada. Issue fechada automaticamente se marcada `Closes #N`. Spec correspondente atualizada para refletir o que foi construído.

## Não-escopo

Este workflow não cobre:

- Mudanças triviais (typo, link quebrado, ajuste de copy). Podem ir em PR direto.
- Deploys hotfix de segurança. Acionar diretamente o `main` com mensagem clara no commit.
- Pesquisa. Vai em `docs/research-*.md` independente.

## Ferramentas

- `scripts/new-spec.sh <slug>` — cria `docs/specs/<slug>.md` a partir do template.
- `scripts/new-adr.sh <slug>` — cria `docs/adr/NNNN-<slug>.md` a partir do template.
- `scripts/new-issue.sh` — abre issue no GitHub via `gh` com template preenchido.
- `scripts/check_site.py` — verificação mínima do site, executada em CI.

## Evolução

Este workflow é versionado. Mudanças nele passam por uma spec (`docs/specs/000X-workflow-changes.md`) e um ADR quando mudam regras de governança.
