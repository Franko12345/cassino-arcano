# Cassino Arcano

Blackjack e roleta roguelite com créditos virtuais e design responsável.

- **Vinte & Um:** apostas, metas de lucro, vidas e Talismãs que recompensam estilos diferentes.
- **Órbita 37:** roleta europeia transparente, apostas combinadas e builds de recompensa.
- **Game feel:** áudio procedural opcional, feedback sequencial, partículas, shake proporcional e reduced motion.
- **Sem monetização:** nenhum pagamento, saque, cadastro, anúncio ou autoplay.

## Stack

- Svelte 5 (runes) + TypeScript
- Vite 5
- Sem framework de UI, sem engine de canvas, sem servidor
- Web Audio API para SFX, DOM real para a mesa
- Deploy em GitHub Pages via `actions/deploy-pages`

## Rodar localmente

```bash
npm install
npm run dev      # dev server em http://localhost:5173/cassino-arcano/
npm run build    # gera dist/
npm run check    # svelte-check (TypeScript + Svelte)
npm test         # vitest (cobre a lógica pura em src/lib/game/)
```

O `base: '/cassino-arcano/'` no `vite.config.ts` é necessário porque o projeto é publicado no GitHub Pages sob esse path. Para testar localmente, mantenha esse prefixo na URL.

## Estrutura

```text
src/
├── app.css                    variáveis, animações globais, reduced motion
├── juice.css                  animações opcionais: card-flip, ball-trail, confetti, number-flash
├── main.ts                    entry point: mount(App)
├── main.svelte                shell com roteador por hash
├── lib/
│   ├── router.ts              roteador: #/, #/blackjack, #/roulette
│   ├── components/            Button, RunHud, Shop, TalismanPanel, History, Breakdown
│   ├── effects/
│   │   ├── audio.ts           tone(), shake(), burst(), celebrate()
│   │   └── juice.ts           ball-trail(), confettiBurst(), flashNumber()
│   └── game/                  lógica pura de jogo (TS, sem DOM)
│       ├── cards.ts           tipos de carta
│       ├── deck.ts            embaralhamento Fisher-Yates via crypto
│       ├── blackjack.ts       score, isNatural, isBust
│       ├── blackjack-talismans.ts   outcome + Talismãs
│       ├── roulette.ts        randomNumber, odds, settle
│       ├── roulette-data.ts   conjunto de vermelhos
│       ├── roulette-talismans.ts    settlement + Talismãs
│       └── config.ts          constantes de balanceamento
├── pages/
│   ├── HomePage.svelte
│   ├── BlackjackPage.svelte
│   └── RoulettePage.svelte
└── .nojekyll                  garante deploy direto no GitHub Pages
```

## Workflow

Issue → spec em `docs/specs/` → branch `feat/<n>-<slug>` → PR com review → merge em `main`. Veja `docs/workflow.md`.
