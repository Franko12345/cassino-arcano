# Spec: Melhorias estilo Balatro para a roleta

> Spec reformatada em **Matt Pocock-style** em 2026-08-04. A versão anterior (`docs/specs/0002-roleta-melhorias-balatro-style.md`, issues #2-#6) foi arquivada.

## Problem Statement

A roleta do Cassino Arcano tem cinco Talismãs, todos com efeito fixo por categoria de aposta (número cheio, dúzia, cor, peso, maré). Falta a textura roguelite que faz Balatro ser cativante:

- **Triggers condicionais** ("se acertou cor apostada, multiplique")
- **Consumíveis** de uso único (uma rodada com regra especial)
- **Multiplicadores progressivos** que recompensam consistência sem alterar odds

Sem isso, a roleta fica previsível após duas runs: o jogador aprende os cinco efeitos e não tem mais nada para explorar. O Blackjack recebe mecânicas parecidas em spec futura (fora de escopo aqui).

## Solution

Adicionar cinco mecânicas à roleta, todas respeitando o invariante central do Cassino Arcano:

> **A probabilidade do sorteio nunca muda. Talismãs e consumíveis só alteram recompensa.**

(ADR-0002: dinheiro virtual; regra do projeto: casa honesta.)

As cinco adições:

| # | Tipo | Nome | Efeito | Custo |
|---|------|------|--------|-------|
| 1 | Talismã | Cor Favorita | Cor apostada ganha ×2 sobre o líquido | 50 |
| 2 | Talismã | Dúzia Favorita | Streak de dúzia adiciona +0.5, cap ×3 | 45 |
| 3 | Talismã | Aposta Curta | Total na mesa ≤ 10 paga ×1.5 | 35 |
| 4 | Talismã | Par/Ímpar de Sorte | Par/ímpar com streak ≥ 3 paga ×3 | 40 |
| 5 | Consumível | Casa-Sorte | Próxima rodada: número 0 paga ×5 | 60 |

O Casa-Sorte é o único **consumível** do jogo. Ele aparece na loja entre atos com 30% de chance no slot central. Limite: 1 unidade no inventário. Some entre atos.

## User Stories

1. As a jogador de roleta, I want comprar um Talismã que potencialize minhas apostas em cor, so that eu recompense a consistência nas minhas cores favoritas.
2. As a jogador de roleta, I want ver um multiplicador progressivo quando acerto dúzias em sequência, so that uma run bem-sucedida renda mais do que uma sortuda.
3. As a jogador de roleta cauteloso, I want que apostas pequenas rendam mais, so that eu possa jogar mais rounds com saldo limitado.
4. As a jogador experiente, I want que par/ímpar seja recompensado quando minha streak está alta, so that runs longas tenham picos de recompensa.
5. As a jogador que gosta de riscos, I want um consumível descartável que afeta a próxima rodada, so that eu possa apimentar runs com regras especiais.
6. As a jogador, I want ver claramente na UI qual Talismã está ativo e por quê, so that eu entenda cada mensagem de vitória.
7. As a jogador, I want ver o efeito do Casa-Sorte acontecer em tempo real, so that a sensação de uso único seja tangível.
8. As a jogador novo, I want ver os 5 novos Talismãs como opções na loja, so that eu tenha variedade de escolha entre atos.
9. As a jogador, I want saber o limite do "Aposta Curta" (≤ 10) antes de comprar, so that eu decida com base em estratégia.
10. As a jogador, I want que minha streak zere quando erro uma dúzia, so that o multiplicador de "Dúzia Favorita" seja justo.
11. As a jogador, I want que o Casa-Sorte não persista entre atos, so that ele continue sendo um recurso raro.
12. As a jogador mobile, I want que a UI do inventário de consumíveis seja clara e tátil, so that o uso seja trivial em telas pequenas.

## Implementation Decisions

### Decisões de arquitetura

- **Função pura por Talismã**. Cada Talismã expõe uma função `apply(id, settlement, state) → {multiplier, bonus, notes}`. A função é invocada por `applyTalismans` em `roulette-talismans.ts`. Padrão já estabelecido.
- **Streak de dúzia separada da streak geral**. `state.dozenStreak` (número, 0) convive com `state.streak` (número, 0). Streak geral alimenta Talismã "Maré"; streak de dúzia alimenta "Dúzia Favorita". Reset em fim de ato para ambas.
- **Ordem de aplicação**: modificadores aditivos (bônus) primeiro, modificadores multiplicativos sobre o líquido depois. Documentado no módulo. Justifica-se porque Talismãs aditivos (Maré +5) são independentes eixos, enquanto multiplicadores (Cor Favorita ×2) recompensam o resultado total.
- **Casa-Sorte como tipo novo**. Não é Talismã. Não consome slot de Talismã (limite 3). Existe em `state.consumables: { luckyHouse: 0 | 1 }`. Item some entre atos. Slot central da loja sorteia `luckyHouse` com 30% de chance (seed via `crypto.getRandomValues`).
- **Mecanismo do Casa-Sorte**: ativado no estado, válido para **uma** rodada (`state.luckyHouseActive: boolean`). Settlement lê o flag e multiplica stake ×5 em apostas `number:0`. Decisão pendente: efeito em externas — proposto como (A) só número cheio, debate na issue de ticket.

### Módulos modificados

- `src/lib/game/roulette-talismans.ts`: adicionar 4 funções novas (favoriteColor, favoriteDozen, shortBet, parityHot) e adaptar `applyTalismans` para orquestrar.
- `src/lib/game/roulette.ts`: adicionar `luckyMultiplier?: number` ao `Settlement` (opcional, 5 quando ativo).
- `src/lib/game/config.ts`: adicionar entradas no catálogo `ROULETTE_CATALOG` com custo e descrição.
- `src/lib/game/config.ts`: adicionar `LUCKY_HOUSE_COST = 60` e `LUCKY_HOUSE_CHANCE = 0.3`.
- `src/pages/RoulettePage.svelte`: novo estado `dozenStreak` e `consumables`; novo painel de inventário; novo botão "Usar Casa-Sorte"; lógica da loja sorteando consumíveis.
- `src/lib/components/Inventory.svelte` (novo): mostra Talismãs + Casa-Sorte; usa o `TalismanPanel` existente como base + slot extra.
- `src/lib/effects/juice.ts`: novo efeito `luckyActivated()` (flash dourado curto) quando o item é consumido.

### Contratos (TypeScript, sem paths)

```ts
interface Settlement {
  readonly staked: number;
  readonly returned: number;
  readonly net: number;
  readonly types: Set<string>;
  readonly numberWin: boolean;
  readonly dozenWin: boolean;
  readonly luckyMultiplier?: number; // 5 when active and zero hits; default 1
}

interface RouletteMods {
  bonus: number;
  multiplier: number;
  notes: string[];
}

interface Consumables {
  luckyHouse: 0 | 1; // single-slot consumable inventory
}
```

### Decisão de UI

- Inventário de consumíveis fica na sidebar, abaixo do painel de Talismãs.
- Botão "Usar" só fica ativo quando o jogador tem o item E não há rodada ativa.
- Mensagem de ativação aparece no breakdown da rodada: `Casa-Sorte ×5 ativa`.

## Testing Decisions

### O que torna um teste bom

- Testa **comportamento externo** (entrada + saída esperada), não implementação interna.
- Para settlement: dado um estado e uma rodada, qual é o retorno?
- Para UI: a mensagem, o botão, a transição de estado aparecem como esperado?

### Módulos testados (Vitest)

- `roulette-talismans.ts`: 4 novos Talismãs com casos felizes e de não-aplicação.
  - `favoriteColor`: cor apostada + zero não dispara; rodada toda de cor preta + Cor Favorita não dispara.
  - `favoriteDozen`: streak 0 → ×1, 1 → ×1.5, 2 → ×2, 3+ → ×3 (cap).
  - `shortBet`: total 10 dispara; total 11 não dispara.
  - `parityHot`: streak 2 não dispara; streak 3 com par acerto dispara; zero nunca dispara.
- `roulette.ts`: settlement respeita `luckyMultiplier` quando ativo.

### Padrão de teste para todos

Cada Talismã novo ganha um arquivo `*.test.ts` ao lado com a estrutura:

```ts
describe('talisman: favoriteColor', () => {
  it('does not trigger when no color bet won', () => { /* ... */ });
  it('doubles net when a color bet won', () => { /* ... */ });
  it('does not apply to zero (green)', () => { /* ... */ });
});
```

### Smoke test visual

Após merge na PR:

- Capturar **imagens** (screenshot do navegador) de cada mecânica funcionando.
- Anexar na PR description.
- Cobrir pelo menos: loja com Casa-Sorte, ativação do Casa-Sorte, mensagem de Cor Favorita, mensagem de Aposta Curta.

### Cobertura de browser

- Vite preview local em `http://127.0.0.1:4180/cassino-arcano/`.
- Fluxos exercidos: comprar Talismã → próxima rodada → verificar mensagem.
- Casa-Sorte: comprar → usar → próxima rodada → verificar flash + mensagem.

### Forma de interagir melhor

Cada mecânica precisa de uma **condição observável** sem precisar esperar RNG. Para o demo:

- Botão "Forçar número" em modo dev: injeta o resultado da próxima rodada para testar o efeito. Não vai para produção (atrás de `import.meta.env.DEV`).

## Out of Scope

- Replicação para blackjack (próxima spec).
- Boss Blind (decidido fora pelo usuário nesta onda).
- Edição visual dos Talismãs (textura, ícone). Texto só.
- Decks de início de partida (continua sempre roleta europeia).
- Alteração de balanceamento nos targets, vidas, ou mãos.
- Mudança no CI, branch protection, ou workflow SDD além do necessário para issues filhas.

## Further Notes

- Decisão (A/B) sobre escopo do Casa-Sorte: proposta inicial é (A) só `number:0`. Debater na issue filha antes do código.
- Custos calibrados para que uma run de cinco atos não consiga comprar tudo. Jogador precisa escolher.
- Casa-Sorte **sempre** disponível se a loja sortear; sem limite de quantidade por ato (mas inventário é 1).
- Streak de dúzia zera em qualquer resolução de rodada (vitória, derrota, push). Não acumula através de Talismãs.
- Os números de `ROULETTE_TARGETS` permanecem inalterados. As novas mecânicas mudam **ganho esperado** mas não **dificuldade**.