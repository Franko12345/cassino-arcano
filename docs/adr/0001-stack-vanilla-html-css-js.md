# Stack: HTML/CSS/JS nativo sem framework

- **Status:** Superseded (por Svelte 5 + TypeScript + Vite, 2026-08-04)
- **Data original:** 2026-08-04
- **Contexto:** Cassino Arcano (dois jogos roguelite single-player, GitHub Pages, créditos virtuais)

> **Atualização 2026-08-04:** Stack migrou para Svelte 5 + TypeScript + Vite (PR #1).
> Este ADR permanece como histórico. A nova decisão de stack foi feita por conversa
> direta entre manter e agente; a comparação técnica de alternativas abaixo continua
> válida para referência futura (e.g., se um terceiro jogo justificar engine).
>
> Status mudado de "Aceito" para "Superseded" para refletir a realidade sem reescrever
> a numeração do ADR (preserva histórico de decisão).

## Contexto e problema

A interface do cassino é predominantemente DOM: botões, painéis, modais, cartas como `<div>`, a "roda" da roleta como `conic-gradient`, partículas como elementos posicionados. A escolha de stack determina o tamanho do bundle, a complexidade do build e a qualidade do suporte para desenvolvimento assistido por IA.

## Decisão

O projeto usa HTML, CSS e JavaScript nativos, sem framework de UI e sem engine de jogo. Build via Vite apenas se justificado por módulos; deploy em GitHub Pages via `actions/deploy-pages`.

## Alternativas consideradas

- **Svelte 5 + TypeScript + Vite** — melhor framework web pesquisado. Reduz boilerplate de reatividade. Adiciona dependência de build mesmo sem complexidade de jogo.
- **Phaser 4 + TypeScript + Vite** — engine 2D mais completa. Oferece 28 skills oficiais para agentes de IA. Adiciona 1,1 MB e exige migração da UI para canvas.
- **Excalibur.js** — engine TypeScript-first. Pré-1.0, ecossistema menor.
- **PixiJS 8** — renderer WebGL/WebGPU. Não inclui física, áudio, cenas, tilemap.
- **KAPLAY** — sucessor de Kaboom. Comunidade menor.
- **React 19** — maior ecossistema, mais boilerplate, exige mais cuidado com agentes de IA.

## Consequências

**Positivas:**

- Zero dependências de runtime. Custo de manutenção praticamente nulo.
- HTML semântico mantém acessibilidade (leitor de tela, foco por teclado, `aria-live`, `prefers-reduced-motion`).
- Custo de modelo de IA: 100% presente em dados de treino; sem DSL intermediária para alucinar.
- Bundle final inferior a 100 KB.
- GitHub Pages trivial: `git push` ou um único step de action.

**Negativas:**

- Componentes da UI são re-renderizados manualmente; `state` é fonte de verdade única, funções `render()` cuidam do DOM.
- Falta de validação estática e tipos. Decisões de tipos serão adicionadas via TypeScript em momento posterior se a complexidade aumentar.
- Sem reatividade declarativa, alguns trechos exigirão mais disciplina para evitar sincronização manual.

## Quando reconsiderar

1. A UI ganhar três ou mais telas que precisem compartilhar estado de forma reativa.
2. Um terceiro jogo exigir centenas de partículas, shaders ou física real.
3. A manutenção manual de `render()` se tornar mais cara que migrar.

## Notas de execução

- Vite pode ser introduzido sem reescrever o conteúdo dos arquivos. Adiciona import/export, dev server com hot reload e build para `dist/`.
- Phaser 4 seria a primeira opção se a UI for, em algum momento, renderizada em canvas. Manter uma camada de "lógica de jogo" separada da camada de UI facilita a migração futura.
- A separação atual em `shared.js` e dois `index.html` por jogo já é o suficiente para a complexidade presente.
