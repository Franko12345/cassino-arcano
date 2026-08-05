# Spec: Melhorias estilo Balatro para a roleta

- **Issue:** #2
- **Status:** Proposta
- **Data:** 2026-08-04

## Contexto

A roleta atual tem cinco Talismãs, todos com efeito fixo por categoria de aposta (número cheio, dúzia, cor, peso, maré). Falta variedade de **triggers condicionais**, **consumíveis** e **regras temporárias por rodada** — exatamente os três eixos que dão textura roguelite no estilo Balatro (Jokers, Spectral, Boss Blind).

O jogador quer "casa fixada com multiplicador" — não confundir com casa viciada. **Mantém-se a equiprobabilidade de 1/37.** O multiplicador atua sobre a recompensa, não sobre o sorteio. Conforme ADR-0002.

## Escopo

- Apenas roleta (blackjack fica intocado).
- Cinco adições, cada uma descrita em "Mudanças visíveis".
- Nenhuma alteração de balanceamento nos targets, mãos ou vidas.
- Nenhuma mudança no CI ou workflow SDD além das issues filhas.

## Fora de escopo

- Replicação para blackjack (próxima spec).
- Boss Blind (descartado nesta onda por escolha do usuário).
- Edição visual dos Talismãs (textura, ícone).
- Deck de início de partida (ainda é sempre roleta europeia).

## Mudanças visíveis

### 1. Talismã "Cor Favorita"

- **id:** `favoriteColor`
- **custo:** 50
- **efeito:** se a rodada termina em uma cor apostada pelo jogador (vermelha ou preta), o lucro líquido recebe `×2`.
- **exceção:** zero (verde) não conta como cor apostada aqui.
- **nota:** o efeito é multiplicador de `net`, não de cada aposta individual. Para evitar dupla contagem com Talismãs que já dão bônus fixo, ordem é: aplica mods aditivos → soma bônus → aplica multiplicador sobre o líquido.

### 2. Talismã "Dúzia Favorita"

- **id:** `favoriteDozen`
- **custo:** 45
- **efeito:** ao acertar uma dúzia, a streak de dúzia aumenta; cada acerto consecutivo adiciona `+0.5` ao multiplicador (cap em ×3). Perder zera a streak.
- **persistência:** a streak de dúzia é distinta da `streak` geral do estado. Reseta entre atos.

### 3. Talismã "Aposta Curta"

- **id:** `shortBet`
- **custo:** 35
- **efeito:** se o valor total apostado na rodada for `≤ 10`, o lucro líquido recebe `×1.5`.
- **exceção:** se a rodada for de "várias apostas pequenas" cuja soma é alta, não conta. Total na mesa precisa ser ≤ 10.

### 4. Talismã "Par/Ímpar de Sorte"

- **id:** `parityHot`
- **custo:** 40
- **efeito:** se a rodada termina em par **ou** ímpar **e** a `streak` geral do estado é ≥ 3 no momento, lucro líquido recebe `×3`. Streak zera em derrota.
- **observação:** zero (verde) não é par nem ímpar; apostas em par/ímpar não pagam em zero, então a regra nunca dispara com zero.

### 5. Consumível "Casa-Sorte"

- **id:** `luckyHouse`
- **tipo:** consumível de uso único por ato.
- **origem:** surge na loja entre atos com 30% de chance no slot central (uma de três ofertas). Pode ser comprado por 60 fichas.
- **efeito:** ao usar antes de girar, a próxima rodada tem: zero paga `×5` o stake de qualquer aposta que inclua o número 0 (número cheio ou dúzia?). Decisão abaixo.
- **capacidade:** no máximo 1 unidade no inventário. Desaparece entre atos.
- **uso:** botão visível quando o jogador tem o item; clicar consome e ativa na próxima rodada.

**Decisão pendente para a issue filha #2a:**

- (A) Casa-Sorte afeta só apostas "número cheio em 0" → paga 35×5 = 175:1.
- (B) Casa-Sorte afeta número 0 **e** qualquer dúzia/cor/par-ímpar externa se zero sair → paga em todas as externas que normalmente pagariam 0.

Recomendação inicial: (A) — escopo menor, mais legível. Vai para discussão na issue.

## Glossário (termos novos)

- **Multiplicador de líquido:** modificador `×N` aplicado ao lucro líquido (`net`) antes de crédito ao saldo.
- **Streak de dúzia:** contador mantido durante o ato. Incrementa em acerto de dúzia, zera em qualquer outra resolução de rodada.
- **Consumível de ato:** item de uso único que desaparece ao final do ato (loja do próximo ato ou fim do jogo).
- **Total na mesa:** soma de todos os stakes de apostas da rodada, usado pelo Talismã "Aposta Curta".

## Decisões arquiteturais

Nenhuma ADR nova é necessária. ADR-0001 (vanilla) e ADR-0002 (dinheiro virtual) já cobrem o terreno. Talismãs seguem o padrão de função pura que recebe `settlement` e devolve `{multiplier, bonus, notes}`. O padrão já está no módulo `roulette-talismans.ts`.

## Critérios de aceitação

- [ ] 4 Talismãs novos implementados com função pura
- [ ] 1 Consumível novo (Casa-Sorte) implementado
- [ ] Streak de dúzia é distinta da streak geral
- [ ] Multiplicadores são aplicados APÓS bônus fixos (ordem documentada no módulo)
- [ ] Vitest cobre cada novo Talismã e o Casa-Sorte
- [ ] UI mostra slot do consumível e botão "Usar"
- [ ] `npm run check`, `npm run test`, `npm run build` passam
- [ ] `scripts/check_site.py` passa
- [ ] PR único referencia issue #2 e esta spec

## Plano de verificação

- `npm run check` — typecheck estrito.
- `npm test` — cobrir cada Talismã novo com caso feliz e caso de não-aplicação.
- Browser: smoke test na UI:
  - Loja mostra Casa-Sorte em um slot em ~30% das ofertas.
  - Comprar, usar antes do próximo giro, número 0 sai, multiplicador ×5 aplicado.
  - Compra do Talismã Cor Favorita, aposta em vermelho, verificar mensagem "Cor Favorita ×2".
  - Compra do Talismã Aposta Curta, aposta 5 + 5 = 10, verificar "Aposta Curta ×1.5".
  - Aposta 5 + 5 + 5 = 15, verificar que Aposta Curta NÃO dispara.

## Notas

Decisão de separar streak de dúzia da streak geral foi feita aqui porque a duplicação tornaria `applyTalismans` confuso. Streak geral (vinda do PR #1) alimenta Talismã "Maré"; streak de dúzia alimenta "Dúzia Favorita". Ambas vivem no estado da página, ambas resetam no fim do ato.

Custo de "Aposta Curta" é baixo (35) porque o efeito é restrito a apostas pequenas e precisa estar acessível cedo no ato.

Custo de "Cor Favorita" (50) reflete que cor paga 1:1 e o ×2 dobraria a média geométrica — só vale a pena em corridas longas com consistência.

Custo de "Par/Ímpar de Sorte" (40) reflete a condição `streak ≥ 3` — só dispara em runs longos.