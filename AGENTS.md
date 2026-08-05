# AGENTS.md

Orientações para agentes (humanos ou IA) trabalhando neste repositório. Este arquivo é o ponto de entrada — leia-o inteiro antes de mexer no código.

## Stack atual

- **Svelte 5 + TypeScript + Vite** (sem SvelteKit). `runes: true`.
- **Vitest** para testes unitários e de funções puras de jogo.
- **GitHub Pages** para deploy via `.github/workflows/pages.yml` (`npm ci + npm run check + npm test + npm run build`).
- Ver `docs/adr/0001-stack-vanilla-html-css-js.md` (declarada historicamente, **superseded** em prática; não foi reescrita para evitar churn de histórico).

## Estrutura do repositório

```
.
├── AGENTS.md                      ← este arquivo
├── README.md                      ← descrição pública
├── CONTEXT.md                     ← glossário canônico do domínio
├── CODEOWNERS                     ← @Franko12345
├── package.json                   ← deps + scripts (npm ci/check/test/build)
├── tsconfig.json                  ← TS config (extends @tsconfig/svelte, paths $lib)
├── svelte.config.js               ← runes: true
├── vite.config.ts                 ← alias $lib, base /cassino-arcano/
├── vitest.config.ts
├── src/
│   ├── main.svelte                ← entry; importa app.css + juice.css + roteador
│   ├── main.ts
│   ├── app.css                    ← :root com variáveis CSS globais
│   ├── juice.css                  ← keyframes (card-flip, ball-trail, confetti, lucky-flash)
│   ├── app.d.ts
│   ├── pages/
│   │   ├── HomePage.svelte
│   │   ├── BlackjackPage.svelte
│   │   └── RoulettePage.svelte
│   ├── lib/
│   │   ├── router.ts              ← hash-based
│   │   ├── components/            ← RunHud, Shop, TalismanPanel, History, Breakdown, Button
│   │   ├── effects/               ← audio.ts, juice.ts
│   │   └── game/                  ← blackjack, roulette, deck, cards, talismans (lógica pura)
│   └── ...
├── docs/
│   ├── workflow.md                ← processo SDD
│   ├── specs/                     ← contratos de features (to-spec format)
│   ├── adr/                       ← decisões arquiteturais
│   ├── agents/                    ← (legacy; pode estar vazio)
│   └── ...
├── scripts/
│   ├── new-spec.sh                ← cria nova spec numerada
│   ├── new-adr.sh                 ← cria novo ADR numerado
│   ├── new-issue.sh
│   └── check_site.py              ← smoke test (curl + verifica dist/)
└── .github/
    ├── workflows/pages.yml        ← CI + Pages deploy
    ├── ISSUE_TEMPLATE/{spec,bug,chore,setup}.md
    └── PULL_REQUEST_TEMPLATE.md
```

## Workflow SDD + Matt Pocock

O repo combina SDD (especificações + ADRs versionados) com Matt Pocock-style agent loop:

1. **Specs** em `docs/specs/NNNN-<slug>.md` definem o quê. Use o template `0000-template.md` (formato to-spec: Problem, Solution, User Stories, Implementation, Testing, Out of Scope).
2. **ADRs** em `docs/adr/NNNN-<slug>.md` registram decisões de arquitetura imutáveis.
3. **Issues** com Matt Pocock labels canônicas:
   - `needs-triage` (fbca04) — manter precisa avaliar
   - `needs-info` (0e8a16)
   - `ready-for-agent` (0e8a16) — totalmente especificada, agente pode pegar
   - `ready-for-human` (5319e7)
   - `wontfix` (ffffff)
4. **Loop**: claim → branch (`feat/<issue>-<slug>`) → TDD → code review paralelo (Matt Pocock skill, 2 axes) → corrigir → squash merge → close issue.
5. **Branch protection main**: `strict: true`, `require_checks: ["check"]`, `reviews: 0` (auto-merge habilitado).
6. **Push direto em main** é bloqueado por branch protection. Sempre abra PR.

## Convenções

- **Commits**: Conventional Commits em PT-BR (`feat(roleta): ...`, `fix: ...`, `docs(spec): ...`, `chore: ...`).
- **Idioma**: PT-BR em código, comentários, specs, ADRs, mensagens.
- **CSS**: escopado via Svelte por padrão; CSS global em `src/app.css` + `src/juice.css`.
- **Comentários órfãos**: proibidos por workflow.md. Regras vivem na spec/ADR/glossário.
- **Funções puras** para lógica testável (settlement, talismãs, RNG derivado).
- **Sorteio**: `crypto.getRandomValues` (Fisher-Yates em `deck.ts`, `randomNumber` em `roulette.ts`).
- **Talismãs**: até 3 por build; alteram só recompensa (nunca sorteio).
- **Créditos virtuais**: proibido dinheiro real, saque, KYC, dark patterns.

## Specs ativas

- `0001-workflow-sdd.md` — Implementada (workflow SDD básico)
- `0002-roleta-melhorias-balatro-style.md` — Implementada (5 mecânicas Balatro: Cor Favorita, Aposta Curta, Par/Ímpar, Dúzia Favorita, Casa-Sorte; issues #7-#11)
- `0003-roleta-ponteiro-stack-repetir.md` — Implementada (ponteiro sincronizado, stack visual de chips, highlight, botão Repetir; issues #19-#21; PRs #22-#24)

## Issues abertas

Verifique `gh issue list --state open`. Última contagem conhecida:
- 0 (limpas após merges do loop)
- Caso a issue parent #12 (spec antiga) ainda esteja `needs-triage`, mova para `ready-for-human` ou feche com referência à spec 0002.

## Comandos úteis

```bash
npm install
npm run check       # svelte-check + tsc
npm test            # vitest (rodada completa)
npm run build       # vite build (produz dist/)
python3 scripts/check_site.py   # smoke test: build artifacts presentes

# Branch
git checkout -b feat/<issue>-<slug>
gh issue edit <n> --add-assignee @me
git add -A && git commit -m "..."
git push -u origin feat/<n>-<slug>
gh pr create --base main --head feat/<n>-<slug> --title "..." --body "Closes #n"

# CI
gh run list --workflow pages.yml --branch main --limit 1

# Deploy check
curl -s https://franko12345.github.io/cassino-arcano/ | grep -oE 'index-[^"]+\.(css|js)'
```

## Pendências conhecidas

- ADR-0001 ainda declara vanilla HTML/CSS/JS; **superseded** em prática por Svelte 5 + TypeScript + Vite (decisão do PR #1). Atualizar a redação sem reescrever a numeração para preservar histórico.
- `Settlement.luckyMultiplier` é `required: number` no código, opcional (`?`) na spec 0002 — spec delta pendente.

## Skills instaladas em `~/.agents/skills/`

Matt Pocock: `setup-matt-pocock-skills`, `to-spec`, `to-tickets`, `triage`, `implement`, `tdd`, `code-review`.
Hermes: `ponytail`, `caveman`, `domain-modeling`, `grill-me`, `diagnosing-bugs`, `claude-handoff`.