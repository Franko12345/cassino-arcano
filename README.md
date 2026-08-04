# Cassino Arcano

Dois jogos de cassino single-player transformados em expedições roguelite originais, com créditos exclusivamente virtuais.

- **Vinte & Um:** apostas, metas de lucro, vidas e Talismãs que recompensam estilos diferentes.
- **Órbita 37:** roleta europeia transparente, apostas combinadas, contratos e builds de recompensa.
- **Game feel:** áudio procedural opcional, feedback sequencial, partículas, shake proporcional e reduced motion.
- **Sem monetização:** nenhum pagamento, saque, cadastro, anúncio ou autoplay.

## Rodar

```bash
python3 -m http.server 8000
```

Abra http://localhost:8000.

## Estrutura

```text
index.html          salão e escolha do jogo
shared.css          sistema visual e acessibilidade
shared.js           áudio, feedback, loja e utilidades comuns
blackjack/index.html
roulette/index.html
docs/research.md    pesquisa principal, fontes e decisões
docs/balatro-design-synthesis.md  análise aprofundada de sistemas
docs/game-feel-juice.md          spec aprofundada de feedback e acessibilidade
docs/responsible-design.md       regulação, psicologia e guardrails
CONTEXT.md           contexto canônico para manutenção
```

Sem framework ou build: o escopo cabe em APIs nativas e abre em qualquer servidor estático.

## Ética e transparência

A roleta usa 37 resultados equiprováveis via `crypto.getRandomValues` com rejection sampling. Talismãs modificam somente recompensas visíveis, nunca o sorteio. Retorno igual à aposta não é celebrado como vitória. Consulte [`docs/research.md`](docs/research.md).
