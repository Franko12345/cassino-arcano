# Pesquisa de frameworks JS — Cassino Arcano

> Pesquisa comparativa para decidir stack do projeto `/home/hermes/cassino`. Atualizado em agosto de 2026 a partir de sites oficiais, GitHub e documentação pública. Não é plano de implementação.

## Contexto do projeto atual

- **Tipo:** blackjack + roleta roguelite, single-player, créditos virtuais, **GitHub Pages**.
- **Código atual:** HTML + CSS + JS nativo, ~80 KB totais. Sem `package.json`, sem build. Cards são `<div class="card">`, a "roda" da roleta é um `conic-gradient` rotacionado, áudio é WebAudio procedural, partículas são `<i>` posicionados.
- **O DOM já resolve quase tudo.** O uso real de canvas é zero. Os dois playgrounds são essencialmente fluxo de estado + UI, com animação CSS/WebAudio para "game feel".

Pergunta: vale a pena migrar para engine/renderer? Ou adicionar framework web ajuda especificamente em alguma coisa?

## TL;DR — recomendação

**Manter a arquitetura DOM e migrar incrementalmente para TypeScript + Vite; sem framework de UI ou engine agora.** Razões:

1. O projeto é **DOM-first** em todos os sentidos (cartas, mesa, loja, HUD). Engines de canvas (Phaser, Kaplay, Excalibur, melonJS, PixiJS) iriam **substituir** uma arquitetura que já funciona, sem ganho real de qualidade.
2. Tamanho do projeto (~80 KB) é menor do que qualquer engine adicionada. Phaser 4 minificado ≈ 1.1 MB; Kaplay ≈ 500 KB; PixiJS ≈ 440 KB.
3. Vanilla é a stack com **maior previsibilidade para agentes de IA**: HTML/CSS/JS aparece em 100% dos dados de treino e não há DSL de cena intermediária para o modelo aprender.
4. Para "game feel" (partículas, shake, áudio procedural), as implementações atuais (CSS keyframes, WebAudio, `requestAnimationFrame`) já cobrem o necessário.
5. **Migração para engine de jogo traz riscos concretos** sem benefício funcional para cartas/roda em gradiente.

**Único caso válido para adicionar algo:** se crescer o escopo para **telas inteiras em canvas** (roleta 3D, slot machine com física, mesa com shader, ou um terceiro jogo de outro gênero). Aí Phaser 4 é a primeira opção; PixiJS como segunda.

---

## Categorias e diferenças conceituais

| Categoria | Exemplo | Para que serve | Quando NÃO serve |
|---|---|---|---|
| **Framework web (UI)** | React, Svelte, Vue | Componentes reativos, estado, render declarativo | Renderização por frame (canvas/animation loop) |
| **Game engine** | Phaser, Excalibur, melonJS, Kaplay | Loop de jogo, física, sprites, tilemap, áudio, cenas completas | UI e-commerce/admin (overkill) |
| **Renderer 2D** | PixiJS | Sprites WebGL/WebGPU, batching, shaders, drawing primitives | Lógica de jogo, física, UI geral |

Misturar dá trabalho: usar React + Phaser significa sincronizar DOM (React) com canvas (Phaser) — duas fontes de verdade. Cassino Arcano é o oposto disso.

---

## Matriz comparativa (pontuação 0–5)

Pesos segundo o pedido: **simplicidade · suporte a jogos · ecossistema/docs · adequação a IA**.

| Stack | Tipo | Tamanho | Simplicidade | Jogos | Ecos./docs | AI-friendly | Total |
|---|---|---|---|---|---|---|---|
| **Vanilla TypeScript + Vite** | Tooling, sem framework | 0 KB runtime | 5 | 2 | 5 | **5** | **17** |
| **Kaplay** | Engine | ~500 KB | 4 | 4 | 3 | 3 | 14 |
| **Phaser 4** | Engine | ~1.1 MB | 2 | **5** | **5** | 4 | 16 |
| **Excalibur.js** | Engine | ~250 KB | 3 | 4 | 3 | 3 | 13 |
| **PixiJS 8** | Renderer | ~440 KB | 3 | 3* | 4 | 3 | 13 |
| **melonJS 19** | Engine | ~180 KB | 3 | 4 | 2 | 2 | 11 |
| **Svelte 5** | Framework web | runtime pequeno | 4 | 1 | 4 | 4 | 13 |
| **React 19** | Framework web | runtime médio | 2 | 1 | 5 | 4 | 12 |

\* PixiJS só conta "3" em jogos porque é renderer — física, áudio, cenas vêm por fora.

Observações por critério:

- **Simplicidade:** vanilla vence porque o projeto já cabe. Svelte é próximo por causa do compilador. React com JSX/tooling é o mais burocrático.
- **Suporte a jogos:** Phaser 4 é a referência de mercado para 2D web; Kaplay é o mais rápido para protótipos; Excalibur e melonJS têm game loop completo. Web frameworks (React/Svelte) não pontuam aqui.
- **Ecossistema/docs:** Phaser tem a maior base (15+ anos, exemplos abundantes, editor visual próprio). React tem o maior ecossistema geral. Vanilla depende do que o time já conhece.
- **Adequação a IA:** vanilla é 100% presente em dados de treino; Phaser 4 inclui **28 AI agent skills oficiais** no repo (relevante); Svelte 5 runes é mais previsível que React hooks em gerações longas.

---

## Resumo por opção

### Vanilla HTML/CSS/JS (estrutura atual)

- **URL:** nenhum — APIs nativas (MDN https://developer.mozilla.org/).
- **Forças:** zero deps, zero build, auditável, GitHub Pages trivial, debug direto no DevTools.
- **Limites:** sem física pronta, sem tilemap, looping de jogo escrito à mão.
- **Adequação a IA:** a melhor. LLMs emitem HTML/CSS/JS sem erros conceituais; não há DSL intermediária.
- **Risco de migração:** zero (é o que está rodando).

### Vite + Vanilla TypeScript (recomendação)

- **URL:** https://vite.dev
- **Forças:** HMR, build, ESM, `import`/`export`, tipos estáticos e testes de lógica; mantém DOM/CSS sem framework e adiciona zero runtime.
- **Limites:** adiciona build step (compatível com GitHub Pages via `vite build` → `dist/`).
- **Adequação a IA:** excelente: Vite e TypeScript têm enorme corpus; tipos tornam contratos de estado e Talismãs verificáveis por `tsc`.
- **Risco de migração:** baixo se feito módulo a módulo, preservando HTML/CSS e o site publicado durante a transição.

### Kaplay (sucessor de Kaboom.js)

- **URL:** https://kaplayjs.com / https://github.com/kaplayjs/kaplay
- **Forças:** API curtíssima, ótimo para protótipos e game jams; voltado a 2D simples.
- **Limites:** comunidade menor que Phaser; renderiza em canvas (não preserva DOM).
- **Adequação a IA:** razoável; funções como `add()`, `onClick()`, `loadSprite()` saem corretas, mas exemplos de treinamento são mais escassos.
- **Risco de migração:** médio-alto. Quebra a arquitetura DOM-heavy; exigirá reescrever cartas, mesa, loja e HUD em canvas/scene graph.

### Phaser 4 ("Caladan" / 4.2.1 "Giedi", jul/2026)

- **URL:** https://phaser.io / https://docs.phaser.io / https://github.com/phaserjs/phaser
- **Forças:** engine 2D mais madura; novo renderer WebGL node-based, SpriteGPULayer (até 1M sprites por draw call), filtro unificado, AI Agent Skills oficiais inclusos.
- **Limites:** 1.1 MB minificado; curva de aprendizado; cenas/tilemap/física são um mundo a abraçar.
- **Adequação a IA:** **acima da média** — repo tem `skills/` com 28 arquivos por subsistema. Phaser publicou a v4 com esse diferencial explícito.
- **Risco de migração:** alto. Substitui DOM por canvas; v3 → v4 tem guia oficial mas é uma reescrita grande.

### Excalibur.js 0.30.0

- **URL:** https://excaliburjs.com / https://www.npmjs.com/package/excalibur
- **Forças:** TypeScript-first, API amigável, boa estrutura (Actors, Scenes, Components).
- **Limites:** ainda em 0.x; ecossistema e exemplos menores que Phaser.
- **Adequação a IA:** moderada — TS ajuda a checar tipos, mas menos dado de treino público.
- **Risco de migração:** alto. Mesma razão do Phaser.

### PixiJS 8.16.0

- **URL:** https://pixijs.com / https://github.com/pixijs/pixijs
- **Forças:** renderer WebGL/WebGPU de referência; v8 simplificou a API (`async init()`); ótimo batching.
- **Limites:** **não é engine** — física, áudio, cenas, tilemap precisam de bibliotecas separadas.
- **Adequação a IA:** moderada; APIs recentes (v8 async) ainda variam entre versões nos snapshots.
- **Risco de migração:** alto. Domínio menor que o projeto atual (só rendering); portanto, traz dependências adicionais.

### melonJS 19 (último release jul/2026)

- **URL:** https://melonjs.org / https://github.com/melonjs/melonJS
- **Forças:** leve, full engine, fácil de iniciar (`npm create melonjs@latest`).
- **Limites:** comunidade pequena, ritmo de release lento, sintaxe antiga em alguns pontos.
- **Adequação a IA:** baixa — pouco dado de treino recente.
- **Risco de migração:** alto.

### Svelte 5 (runes)

- **URL:** https://svelte.dev / https://svelte.dev/blog/runes
- **Forças:** compilador; código gerado pequeno; ótima DX para UI reativa.
- **Limites:** não substitui engine; precisaria de canvas/Phaser por baixo.
- **Adequação a IA:** boa — runes (`$state`, `$derived`) transmitem intenção clara; LLMs acertam bem.
- **Risco de migração:** médio. Reorganiza o `render()` atual em componentes, mas a lógica de jogo continua manual.

### React 19

- **URL:** https://react.dev
- **Forças:** ecossistema gigante; padrões consolidados; muita documentação.
- **Limites:** boilerplate; tamanhos de runtime; difícil de coordenar com canvas.
- **Adequação a IA:** boa, mas exige JSX/toolchain (build, JSX transforms), e erra mais em edge cases avançados.
- **Risco de migração:** médio-alto. Mudança estrutural grande; mais sentido em UI real com formulários complexos do que em jogos.

---

## Comparação rápida para o caso de uso

| Necessidade concreta do Cassino Arcano | Engine resolve? | Vanilla resolve? |
|---|---|---|
| Renderizar cartas (HTML/CSS) | Substitui por canvas — pior para acessibilidade | Sim, hoje |
| Animar "deal" das cartas | Tween/Phaser — overkill | CSS keyframe + `animation-delay` |
| Animar rotação da roda | `Phaser.Tweens`, `Tween` próprio | `transform: rotate()` + `transition` (já feito) |
| Estado da run (5 atos, vidas, metas) | Phaser `registry` | Objeto `state` (já feito) |
| Loja de talismãs | Phaser UI plugins | `overlay` DOM (já feito) |
| Partículas (vitória grande) | Sistema de partículas | `<i>` posicionados (já feito) |
| Áudio procedural | Phaser Sound Manager | WebAudio API (já feito) |
| Publicar no GitHub Pages | Build + assets extras | `git push` (já funciona) |
| Acessibilidade (ARIA, reduced motion) | Precisa reconfigurar | Já implementado |

Em todos os pontos, **a solução atual já é equivalente ou melhor** à que uma engine daria.

---

## Quando reconsiderar

Trocar faz sentido **se** aparecer uma destas:

1. **Slot machine ou jogo novo com física real** (colisões, gravidade, partículas pesadas) → **Phaser 4** (ou PixiJS + matter.js).
2. **Centenas de sprites animados** simultaneamente (combo de cartas, dealer animado, efeitos em cascata) → **Phaser 4 com SpriteGPULayer**.
3. **Filtros/shaders pesados** (motion blur, glow em tempo real) → **PixiJS 8** ou recursos nativos do Phaser 4.
4. **UI administrativa fora dos jogos** (painel de talismãs, anotações, save game detalhado) → **Svelte 5** ou React.

Nada disso está no escopo atual. Cassino Arcano é, por desenho, "cartas em mesa, números grandes, rotação curta" — favela-friendly para vanilla.

---

## Riscos de migração (genéricos)

- **DOM → canvas** perde acessibilidade nativa (leitor de tela, foco, navegação por teclado) — bars de aposta, escolha de talismã e mensagens já são `aria-live` em HTML.
- **SPA / framework** exige build, tornando GitHub Pages dependente de `dist/` versionado ou action de CI.
- **Engine versionada** vira dívida: Phaser 4 mudou render pipeline; Kaplay é pós-Kaboom (pouca herança); Excalibur 0.x sinaliza API instável.
- **Treino de IA** é enviesado para vanilla/CSS; quanto mais DSL intermediária, mais "alucinações" de API.
- **Tamanho do bundle** sobe. O projeto inteiro (80 KB) é menor que qualquer engine.

---

## Fontes consultadas (agosto/2026)

- Phaser 4.0.0 release notes (10 abr 2026) e 4.2.1 "Giedi" (9 jul 2026) — https://phaser.io/news/2026/05/phaser-3-vs-phaser-4, https://phaser.io/download/release/v4.2.1, discussão v4.0.0 no GitHub.
- PixiJS 8.16.0 — https://pixijs.com/blog/8.16.0 e v8 launch post.
- Excalibur.js 0.30.0 — https://excaliburjs.com/blog/excalibur-0-30-0-released/.
- Kaplay (sucessor de Kaboom) — https://kaplayjs.com/.
- melonJS 19.9.0 (14 jul 2026) — https://enginesdatabase.com/engine/melonjs/, https://github.com/melonjs/melonJS.
- Svelte 5 runes — https://svelte.dev/blog/runes.
- React 19 — https://react.dev.
- Comparação Phaser vs Kaplay vs Excalibur 2026 — https://phaser.io/news/2026/04/phaser-vs-kaplay-vs-excalibur-2d-web-game-framework.
- Capacidades de LLMs em web/games — https://arxiv.org/html/2604.18394v1 (OpenGame), https://www.linkedin.com/pulse/testing-llms-web-game-development-aleksandar-dimov-kgfwe.
