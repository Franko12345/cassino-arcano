# Cassino Arcano — contexto do projeto

## Produto

Dois jogos single-player em HTML/CSS/JS nativo:

- `blackjack/`: blackjack reconhecível dentro de uma expedição roguelite;
- `roulette/`: roleta europeia com apostas transparentes dentro de uma expedição roguelite.

Créditos são estritamente virtuais. Sem compra, saque, cadastro, monetização ou servidor.

## Design pillars

1. **Regras familiares, decisões novas ao redor.** Não quebrar blackjack/roleta para adicionar profundidade.
2. **Sorte administrável, não fingidamente controlável.** Builds mudam recompensas e risco; nunca fraudam sorteio ocultamente.
3. **Resultado explicável.** Base → Talismãs → total, sempre legível.
4. **Feedback proporcional.** Clique curto; evento raro grande. Reduced motion respeitado.
5. **Run curta e recombinável.** Cinco atos, três vidas, até três Talismãs.
6. **Ética explícita.** Sem dark patterns, near miss fabricado, autoplay ou falsa vitória.

## Direção visual

Cassino art déco ocultista original:

- feltro petróleo e verde profundo;
- latão envelhecido e marfim;
- vinho para risco/perda;
- geometria gravada, selos e Talismãs abstratos;
- serif display + sans humanista de sistema;
- sem pixel art, CRT, Jokers ou trade dress de *Balatro*.

Superfície primária: **Operate**. Estado da run, ação atual e causalidade do resultado têm prioridade.

## Stack

Sem framework. O projeto é pequeno, estático e sem servidor; HTML/CSS/JS nativo reduz dependências, build e manutenção. Use Web Audio API para SFX procedurais e `localStorage` somente para preferências/recorde.

## Regras de implementação

- lógica de pontuação e pagamentos em funções puras quando possível;
- arrays de dados para metas e Talismãs, sem classes/factories;
- feedback essencial começa imediatamente;
- animações não bloqueiam input além da resolução necessária;
- todo estado importante também aparece em texto;
- controles com alvo mínimo de 44 px e foco visível;
- `prefers-reduced-motion` desliga shake/partículas/transições longas;
- `innerHTML` só para dados locais fixos, com comentário de segurança;
- manter `console.assert` para invariantes centrais.

## Balanceamento inicial

Runs usam metas simples e números concentrados no início. Talismãs devem abrir estratégias, não ser escolhas universais. Se um item for sempre escolhido ou nunca escolhido, ajuste um número antes de adicionar regra.

## Verificação mínima

- blackjack: ás flexível, natural 3:2, empate, bust, cinco cartas, efeitos passivos;
- roleta: 37 resultados uniformes via rejection sampling, pagamentos 35:1/2:1/1:1, zero perde apostas externas, efeitos passivos;
- run: avanço, perda de vida, fim e reset;
- browser: console limpo, fluxo completo, mobile 360 px, reduced motion;
- relatório final PASS/FAIL com escopo.

Leia `docs/research.md` para decisões e fontes; `docs/balatro-design-synthesis.md`, `docs/game-feel-juice.md`, `docs/responsible-design.md` e `docs/research-js-frameworks.md` preservam as pesquisas aprofundadas.
