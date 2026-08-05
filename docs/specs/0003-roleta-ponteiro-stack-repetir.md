# Spec: Sincronização roleta + stack visual de fichas + repetição

- **Issue:** #19
- **Status:** Implementada
- **Data:** 2026-08-05

## Contexto

A roleta atual tem três problemas independentes que se tornam visíveis durante o uso:

1. **Drift visual número↔roda**: o ponteiro da roda gira para um ângulo `rotation += 1080 + (a[0]! % 360)` que usa um **número aleatório diferente** do `randomNumber()` sorteado. O ponteiro para uma cor/casa arbitrária da roda, mas o número que aparece no canto é o sorteado real. Jogador esperaria que a cor onde o ponteiro parou correspondesse ao número exibido.

2. **Apostas sem feedback visual de stack**: apostar 25 em "Vermelho" mostra a classe `.bet` mas o jogador não vê quantas fichas nem quais valores já foram apostados naquela casa. Apostas múltiplas (ex: 10 + 15 = 25) também não são discriminadas.

3. **Falta "Repetir última aposta"**: depois de uma rodada, o jogador precisa re-montar manualmente todas as apostas. Botão "Repetir" reaplicaria o último estado de apostas.

## Solution

Três adições à roleta, todas em conformidade com o invariante central: **o sorteio não muda de probabilidade, só a apresentação e a UX**.

### 1. Ponteiro da roda alinhado ao número sorteado

A roda passa a girar para um ângulo calculado a partir do `number` sorteado, não de um aleatório independente. A posição 0° da roda corresponde a uma casa fixa (padrão art déco: começa em zero e avança em ordem cíclica). O ângulo final fica entre 1440° (4 voltas) e 1800° (5 voltas) para completar o spin dramático.

Cada número de 0 a 36 ocupa uma fatia de 360/37 ≈ 9.73°. O ponteiro no topo (`top: -7px`) deve cair **no centro** da fatia do número sorteado. O `randomNumber()` decide o resultado, e o `rotation` é derivado dele.

Cálculo: o ângulo-alvo é `((37 - number) % 37) * (360/37)`. O `% 37` resolve o caso `number=0` (sem rotação, já está na posição inicial — equivalente à especificação original mas evita uma volta completa desnecessária). Jitter aleatório de ±2° dentro da fatia para variação visual. O `rotation` final = `1440 + ângulo + jitter`.

### 2. Stack visual de fichas nas casas apostadas

Cada botão de aposta (número 0-36, dúzia, externa) acumula um stack de chips no canto superior direito. Cada chip individual no stack mostra a denominação (5, 10, 25, 50). O stack é cumulativo: 3 apostas de 5 viram 3 chips de 5 empilhados.

Ordem do stack: mais recente embaixo, mais antigo no topo. Cada chip é uma miniatura circular colorida (5 = dourado, 10 = azul, 25 = vinho, 50 = roxo — mesmo esquema da `chips` de seleção de ficha).

Quantidade: até 5 chips visíveis por casa. Se houver mais, mostrar `+N` ao final.

### 3. Botão "Repetir última aposta"

Botão novo no topbar, ao lado do `Girar`. Habilitado quando o jogador já girou pelo menos uma vez **e** tem saldo suficiente para cobrir o total da última aposta. Comportamento:

- Sem histórico: botão desabilitado
- Saldo insuficiente: botão desabilitado + tooltip "Saldo insuficiente"
- Caso normal: clonar `state.bets` da última rodada e popular o estado atual; mesmo stake, mesmo tipo, mesmo valor por aposta

O histórico vive na `RoulettePage` como `lastBets: Map<string, Bet> | null` (null = sem rodada anterior). É resetado entre runs (mesmo comportamento do `streak`).

## User Stories

1. As a jogador de roleta, I want ver o ponteiro da roda cair sobre a cor do número sorteado, so that o resultado visual bata com o número exibido.
2. As a jogador, I want ver o ponteiro da roda girar de forma dramática (3+ voltas) antes de parar, so that a sensação de suspense seja preservada.
3. As a jogador, I want ver pequenas fichas empilhadas nas casas apostadas, so that eu saiba exatamente quanto já coloquei.
4. As a jogador, I want ver o valor discriminado (10 + 15 = dois chips, não um "25"), so that eu entenda o histórico da minha aposta.
5. As a jogador, I want ver no máximo 5 chips visíveis + `+N` quando passar, so that a UI não polua o botão.
6. As a jogador, I want ver um botão "Repetir" depois de uma rodada, so that eu re-aposte a mesma configuração sem montar tudo de novo.
7. As a jogador, I want que "Repetir" não funcione se eu não tiver saldo, so that eu não comece uma rodada quebrada.
8. As a jogador, I want que o stack de chips e a cor do botão reflitam a aposta atual, so that eu veja quanto de cada denominação já está apostado.
9. As a jogador, I want ver a casa do número sorteado destacada (highlight) na grade de números por 2-3s, so that eu encontre rápido o resultado.

## Implementation Decisions

### Decisões de arquitetura

- **`lastBets` como `Map<string, Bet> | null`** no estado da `RoulettePage`. Reset entre runs. Não persistido (sem `localStorage`).
- **Stack de chips renderizado como `<i>` empilhados dentro de cada botão de aposta**. CSS posiciona cada chip em coordenadas absolutas com z-index decrescente. Cores vêm de variáveis CSS `--chip-{denom}`.
- **Jitter do ponteiro**: ±2° (1° de cada lado do centro da fatia). Suficiente para variação visual sem parecer desonesto.
- **Highlight da casa sorteada na grade**: adiciona classe `.last-result` ao botão do número sorteado por 2.5s, com fade-out.

### Módulos modificados

- `src/lib/game/roulette.ts`: exportar `numberToAngle(number: number): number` que retorna o ângulo de rotação em graus (0-360).
- `src/pages/RoulettePage.svelte`:
  - Computar `rotation` a partir de `number` (não mais aleatório independente)
  - Renderizar stack de chips em cada botão de aposta (números 0-36, dúzias, externas)
  - Adicionar estado `lastBets: Map<string, Bet> | null`
  - Adicionar botão "Repetir" no topbar
  - Adicionar `.last-result` à casa sorteada por 2.5s
- `src/app.css` ou `juice.css`:
  - Variáveis `--chip-5`, `--chip-10`, `--chip-25`, `--chip-50`
  - Estilos `.chip-stack`, `.chip-stack > i`
  - Animação `@keyframes chip-pop` para novos chips
  - Classe `.last-result` com fade

### Contratos (TypeScript)

```ts
// roulette.ts
export function numberToAngle(number: number): number;

// RoulettePage.svelte
let lastBets: Map<string, Bet> | null = $state(null);
let rotation: number = $state(0); // agora derivado, não mais aleatório
```

### Decisão de UI

- Stack no canto superior direito do botão, com no máximo 5 chips visíveis. Cada chip com tamanho reduzido (16px), z-index decrescente para criar empilhamento visual.
- Botão "Repetir" entra no topbar, ao lado de "Girar". Texto: "↺ Repetir". Desabilitado quando `lastBets` é null ou saldo insuficiente.
- Highlight da casa sorteada: borda dourada pulsando por 2.5s, com fade-out.

## Testing Decisions

### O que torna um teste bom

- Para `numberToAngle`: dado um número, qual o ângulo esperado? Testar todos os 37 casos para garantir que a fórmula é determinística.
- Para o stack de chips: dado um Map de apostas, quantos chips devem aparecer em cada casa? Como o botão reage a uma nova aposta de mesma denominação?
- Para "Repetir": dado um `lastBets`, o estado de `bets` atual deve ser idêntico após clique? Saldo insuficiente bloqueia o botão?

### Módulos testados

- `roulette.ts` (puro): `numberToAngle` para 0, 18, 36, 1 (boundary) e 17 (genérico).
- `RoulettePage.svelte` (integração via Vitest com `vitest-browser-svelte` se necessário, ou via console do browser):
  - Stack de chips: apostar 5 + 10 + 25 = 3 chips visíveis na casa
  - Repetir: clonar `lastBets` quando há histórico
  - Highlight: classe aplicada e removida após 2.5s
- Smoke test visual: gravar tela da roda durante spin, confirmar que o ponteiro para a cor certa.

### Padrão de teste

```ts
describe('numberToAngle', () => {
  it('returns 0 for number 0', () => {
    expect(numberToAngle(0)).toBe(0);
  });
  it('returns proportional angle for other numbers', () => {
    const a = numberToAngle(0);
    const b = numberToAngle(18); // roughly opposite
    expect(Math.abs(b - a)).toBeGreaterThan(170);
  });
});
```

## Out of Scope

- Animação de "slot machine" para cada número individual rolando antes de parar.
- Histórico rolante de apostas anteriores (apenas a última).
- Persistência entre sessões via `localStorage`.
- Customização de cores dos chips.

## Further Notes

- A fórmula de ângulo assume uma ordem específica na roda (0, 1, 2, ..., 36 em sentido horário). Se o art déco do projeto quiser outra ordem, ajustar `numberToAngle` e a CSS do conic-gradient juntos.
- O jitter pequeno (±2°) garante que a casa sorteada seja reconhecível mas o resultado continue parecendo "aleatório" para o olho. Sem jitter, a roda sempre para no ângulo exato, o que pode parecer determinístico demais.
- O stack visual de chips é puramente decorativo (informação já está no `state.bets`). Serve para feedback de UX, não para lógica de jogo.
- "Repetir" só repete a configuração; não repete o resultado. O número sorteado será diferente a cada giro.

## Spec vs code (referência)

Comportamento atual (referência, pré-spec):
- `src/pages/RoulettePage.svelte:106` — `rotation += 1080 + (a[0]! % 360);` (drift entre roda e número)
- `src/pages/RoulettePage.svelte:153-154` — `resultNumber = number; resultColor = color(number);` (cor correta no canto)
- `src/pages/RoulettePage.svelte:227` — `function clear() { balance += total; bets = new Map(); }` (Limpar reseta apostas, não guarda histórico)

Comportamento desejado (pós-spec):
- Ponteiro da roda: ângulo derivado de `number` com jitter
- Stack visual em cada botão de aposta
- Botão "Repetir" no topbar com `lastBets` como histórico de uma rodada
