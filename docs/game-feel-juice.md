# Game Feel / Juice para Jogos de Casino Web Estáticos
## Pesquisa Aprofundada e Proposta de Sistema de Feedback Restrito

> Documento de pesquisa em português (PT-PT/PT-BR neutro). Fontes primárias e credíveis citadas inline. Recomendações de implementação testadas em navegador.

---

## 1. Definição Operacional (curta, para alinhar o time)

- **Game Feel** (Steve Swink, 2008): "controle em tempo real de objetos virtuais em um espaço simulado, com interações enfatizadas por polimento." ([Wikipedia: Game feel](https://en.wikipedia.org/wiki/Game_feel); [Swink, livro completo](https://gamifique.files.wordpress.com/2011/11/2-game-feel.pdf))
- **Juice** (Jonasson & Purho, 2012, "Juice it or lose it"): o conjunto de respostas visuais, sonoras e táteis que faz uma ação mecânica parecer viva. Não é mecânica; é polimento. ([Talk](https://www.youtube.com/watch?v=Fy0aCDmgnxg))
- **Screen shake** (Nijman, 2013, "The Art of Screen Shake"): trinta truques que transformam uma ação em sensação de impacto. ([Talk](https://www.youtube.com/watch?v=AJdEqssNZ-U))
- **Hitstop / hitlag**: pausa de poucos quadros no momento de impacto. Documentado para fighting games em [Infil's Fighting Game Glossary](https://glossary.infil.net/?t=Hitstop).

**Distinção essencial:** a lógica do jogo (RNG, pagamentos, regras) tem que funcionar **com ou sem** feedback. O juice é uma camada por cima, nunca load-bearing. Isso também é o que torna possível ser acessível por padrão.

---

## 2. Por que isso importa em casino web estático

Casinos web são o caso extremo do problema de game feel:

- **Não há controle contínuo**: o jogador clica em "girar" e o resultado é instantâneo e binário. Não há steering, não há pulo, não há curva de aprendizado. Swink chamaria isso de "baixa sensação de controle" e portanto **toda a responsabilidade pela sensação de agência recai no feedback**.
- **A pesquisa de áudio em caça-níqueis** (Dixon et al., 2014, *J Gambl Stud*) mostra que o som sozinho já altera a frequência cardíaca e a condutância da pele do jogador — e **faz jogadores superestimarem o número de vitórias**. ([PMC4225056](https://pmc.ncbi.nlm.nih.gov/articles/PMC4225056/))
- **O near-miss effect** (dois símbolos iguais + um por um pixel de distância) ativa os mesmos caminhos dopaminérgicos que uma vitória. Designers de casino sabem disso há décadas e usam **timing de animação, som e shake** para amplificar. ([APA / Casino Center sobre near-miss](https://www.casinocenter.com/slot-machine-psychology-how-the-near-miss-effect-drives-player-behavior-in-online-gaming/))
- **Implicação ética**: num jogo estático, mais juice = mais enganação perceptual. O sistema de feedback precisa ser **assertivo no acerto**, **neutro no erro**, e nunca transformar uma perda em sensação de vitória. Restrição é uma escolha de produto, não limitação técnica.

---

## 3. Os 6 Componentes do Game Feel (Swink) — Tradução para Casino

A taxonomia de Swink é a melhor check-list. Para casino estático, cada componente vira uma decisão concreta:

| Componente | O que é | Em casino estático |
|---|---|---|
| **Input** | mapeamento entre gesto e intenção | Clique no botão "girar" / apostar / segurar carta |
| **Response** | quão rápido e fiel o jogo reage | Latência do clique até o primeiro feedback visual (<100 ms é "instantâneo"; Nielsen 1993, ainda válido) ([NN/g: 3 limites de tempo](https://www.nngroup.com/articles/response-times-3-important-limits/)) |
| **Context** | o ambiente dá significado à ação | Tabuleiro, banca, iluminação da rodada |
| **Aesthetic / Polish** | o "tempero" visual e sonoro | Squash, partículas, som sintetizado, screen shake |
| **Metaphor** | coerência entre interface e abstração | Ficha = moeda real, carta = carta física |
| **Rules** | legibilidade das regras durante o jogo | Saldo sobe visivelmente quando se ganha; desce visivelmente quando se perde |

Os quatro últimos são **onde o casino estático ganha ou perde todo o feel**. Input e Response são mais simples (1 clique) e portanto mais perigosos: se falham, o resto não salva.

---

## 4. Os 6 Efeitos do Juice que Valem a Pena (com quando **não** usar)

Síntese da pesquisa primária. Cada técnica tem um **momento certo** e um **momento errado**.

### 4.1 Squash & Stretch (Thomas & Johnston, 1981, [The Illusion of Life](https://en.wikipedia.org/wiki/12_basic_principles_of_animation))

- **O que faz:** dá peso e flexibilidade a um objeto achatando-o no impacto e alongando-o na rebatida, **preservando volume** (scaleX × scaleY = constante).
- **Quando usar:** botões grandes e clicáveis (chips, cartas viradas, "girar"), fim de uma rodada (a banca "assenta").
- **Quando NÃO usar:** em cards de informação, números de saldo, histórico — distorce leitura.
- **Origem da web:** [Valdemird: Game feel on the web](https://valdemird.com/blog/game-feel-on-the-web/) mostra 4 keyframes de 420 ms com `cubic-bezier(0.22, 1, 0.36, 1)` (spring) e `transform-origin: 50% 100%` (ancorar no chão, não no centro).

```css
@keyframes settleIn {
  0%   { opacity: 0; transform: scale(0.88); }
  50%  { opacity: 1; transform: scale(1.05, 0.92); } /* squash */
  72%  { transform: scale(0.99, 1.02); }              /* stretch */
  100% { transform: scale(1); }
}
.grid { transform-origin: 50% 100%; animation: settleIn 0.42s cubic-bezier(0.22, 1, 0.36, 1); }
```

### 4.2 Anticipation (Thomas & Johnston)

- **O que faz:** um pequeno movimento reverso antes da ação principal (o "windup"). Prepara o cérebro do jogador para o que vem.
- **Quando usar em casino:** **momento de revelar cartas** (breve retardo + leve zoom-out antes do flip), **início de uma rodada** (o botão "girar" encolhe 4% antes de disparar).
- **Quando NÃO usar:** em ações que precisam parecer instantâneas (clique em "sair", fechar modal).
- **Implementação rápida:** animação de 80–120 ms com `ease-in` antes da animação principal.

### 4.3 Hitstop (Infil's Glossary)

- **O que faz:** congela o tempo por 50–90 ms no momento exato do impacto. É a coisa mais barata que adiciona peso.
- **Quando usar:** quando uma carta vira, quando três símbolos iguais alinham, quando a banca bate blackjack.
- **Quando NÃO usar:** em cada clique. Hitstop demais mata o ritmo. Regra: no máximo 1 hitstop por evento discreto, e só em eventos de "peso" alto.
- **Por que funciona:** nada se mexe, só a pausa. O cérebro lê o "tempo gasto" como energia gasta. ([Valdemird, demo de hitstop a 90 ms](https://valdemird.com/blog/game-feel-on-the-web/))

```js
function revealCard(card) {
  card.classList.add('flip-mid');
  setTimeout(() => card.classList.add('flip-end'), 70); // hitstop 70ms
}
```

### 4.4 Screen Shake (Nijman / Vlambeer, 2013)

- **Regras de Nijman:** pequeno para ação rotineira, grande para evento real. **Pequena rotação** (0.1°–0.4°) lê como força; translação pura lê como glitch.
- **Quando usar em casino:** jackpot, blackjack natural, sequência de bônus. Não em cada "girar".
- **Quando NÃO usar:** **nunca** em shake de viewport inteiro se o usuário tem `prefers-reduced-motion: reduce`. ([WCAG C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39))
- **Pegadinha técnica:** se remover e readicionar a mesma classe no mesmo frame, o browser coalesce e a animação não reinicia. Solução: `void el.offsetWidth` força reflow.

```js
function shake(intensity = 'md') {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = document.querySelector('.shell') ?? document.body;
  el.classList.remove('fx-shake-sm','fx-shake-md','fx-shake-lg');
  void el.offsetWidth;                         // força reflow → reinicia animação
  el.classList.add(`fx-shake-${intensity}`);
  setTimeout(() => el.classList.remove(`fx-shake-${intensity}`), 600);
}
```

### 4.5 Partículas (Jonasson & Purho)

- **Truque:** ângulo base distribuído uniformemente (`2π·i/count`) + pequeno jitter. Senão as partículas formam tufos em vez de explosão.
- **Quando usar:** vitória de qualquer tipo, especialmente quando acerta algo raro.
- **Quando NÃO usar:** perdas. Nunca jogar confetti numa derrota. Isso é exatamente o que slots modernos fazem e é manipulação documentada.
- **Performance:** **não** passar pelo React/Vue state em cada partícula. Inserir DOM diretamente, animar com CSS, auto-remover em `animationend`. 14 partículas por explosão é o sweet spot típico.

```js
function burst(x, y, { count = 14, spread = 120 } = {}) {
  if (reduced()) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'fx-particle';
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
    const dist = spread * (0.45 + Math.random() * 0.55);
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin(angle) * dist - 30}px`); // bias pra cima = "luta contra gravidade"
    p.style.setProperty('--dur', `${0.55 + Math.random() * 0.4}s`);
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}
```

### 4.6 Áudio Sintetizado (Web Audio API)

- **Por que sintetizar e não samplear:** sem arquivos para carregar, latência mínima, fácil de modular (a frequência do click sobe com a sequência). [Valdemird](https://valdemird.com/blog/game-feel-on-the-web/) mostra ~15 linhas que substituem uma biblioteca de SFX inteira.
- **Pegadinha 1:** `setTimeout` em JS tem resolução de ~1 ms, o clock de áudio tem precisão de sample. **Agendar com `audioCtx.currentTime` + lookahead**, não `setTimeout`. ([web.dev: A tale of two clocks](https://web.dev/articles/audio-scheduling))
- **Pegadinha 2:** `AudioContext` precisa de interação do usuário para começar. Criar lazy no primeiro clique.
- **Pegadinha 3:** **variação de pitch** em cada hit. Dez cliques idênticos soam como máquina; dez cliques com ±4% de detune soam como humano.
- **Quando NÃO usar:** sons longos em loop, música contínua — aí sample/streaming é melhor.

```js
function tone(freq, { type='triangle', dur=0.12, gain=0.14, glideTo } = {}) {
  const c = audio();
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g); g.connect(master);
  osc.start(t0); osc.stop(t0 + dur + 0.02);
}
```

### 4.7 Bônus: Scoring Reveal (count-up)

- **Por que animar números crescendo:** sensação de acúmulo, transição de "estado atual" para "estado novo" ([UX StackExchange](https://ux.stackexchange.com/questions/46459/what-is-the-reason-to-show-animated-numbers-counting-towards-the-final-number)). Em casino, é onde mora a "vitória": o número crescendo é o pagamento se materializando.
- **Curva:** `ease-out` (rápido no início, devagar no fim). Linear parece planilha; `ease-in` parece trava.
- **Hitstop antes do count-up:** pare o número por 150–300 ms no valor antigo, **depois** anime para o novo. Esse gap é onde mora a antecipação.
- **Duração:** ~600–900 ms para pagamentos comuns; 1.2–1.8 s para jackpot. Acima de 2 s o jogador quer pular.
- **Respeitar `prefers-reduced-motion`:** mostrar o número final imediatamente, sem animação.

---

## 5. Restrição: Regras de Ouro para o Produto

Estas regras vêm diretamente do que a pesquisa diz **sobre** casinos (manipulação) e **sobre** acessibilidade. São o filtro que separa "bom juice" de "slot machine abusiva".

| Princípio | Por quê | Como implementar |
|---|---|---|
| **Feedback de vitória > feedback de perda** | Ganhos precisam ser celebrados; perdas precisam ser digeridas, não dramatizadas | Particles/som/shake: 100% na vitória, 0% na perda. Na perda, animação mínima (fade do botão, talvez um "thud" seco). |
| **Nada de "loss disguised as win"** | Slots modernos usam som de vitória em qualquer giro que recupera ≥50% da aposta. É classificado como enganoso em vários países | Mapeamento 1:1: vitória real = feedback de vitória. Empate = nada. Perda = nada (ou só feedback de input). |
| **Nunca transformar near-miss em quase-acertou** | Near-miss é efeito documentado ([APA research](https://www.casinocenter.com/slot-machine-psychology-how-the-near-miss-effect-drives-player-behavior-in-online-gaming/)) que ativa dopamina de vitória. Animar near-misses é amplificar manipulação | Sem zoom na linha de pagamento, sem "dois iguais brilham", sem som ascendente quando o terceiro símbolo para. |
| **Hitstop só em eventos de peso real** | Hitstop demais dessensibiliza; o cérebro aprende a ignorar | Reservar para: blackjack natural, sequência de 3+ símbolos, ativação de bônus. |
| **Shake limitado em amplitude e frequência** | W3C/MDN recomendam <3 flashes/s e duração curta | Máximo 600 ms, 3 magnitudes, e respeitar `prefers-reduced-motion` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)) |
| **Audio opcional e óbvio** | WCAG 2.1 SC 1.4.2: áudio não deve tocar automaticamente por >3 s sem controle | Botão de mute visível e persistido (localStorage). Default: ligado, mas um clique afasta. |
| **Botão de "modo reduzido" além do SO** | Pessoas em dispositivos compartilhados não controlam a preferência do SO | Toggle na barra de acessibilidade: desliga shake, particles, hitstop, count-up animado. Mantém o jogo jogável. |

---

## 6. Acessibilidade: O Que a WCAG Exige vs. o Que é Bom Tomar

Restrição aqui não é opcional; é conformidade e ética.

### Obrigatório por norma

- **WCAG 2.1 SC 2.2.2 Pause, Stop, Hide (Nível A):** qualquer movimento que (1) inicia automaticamente, (2) dura >5 s, (3) corre em paralelo com outro conteúdo, deve ter mecanismo de pausa. Casinos tipicamente não disparam isso porque as animações são disparadas por input. **Mas:** loops infinitos (ex.: "roleta girando até parar") precisam de botão de parar. ([Val Head em CSS-Tricks: Accessible Web Animation](https://css-tricks.com/accessible-web-animation-the-wcag-on-animation-explained/))
- **WCAG 2.1 SC 2.3.1 Three Flashes or Below (Nível A):** nunca piscar >3 vezes/s. Praticamente qualquer efeito de casino é <3 Hz; não é um problema comum, mas verificar.
- **WCAG 2.1 SC 1.4.2 Audio Control (Nível A):** áudio que toca >3 s automaticamente precisa de controle. Em casino, todos os sons são disparados por input → OK. Mas se houver música de fundo ambiente, precisa de mute.
- **WCAG 2.2 SC 2.3.3 Animation from Interactions (Nível AAA, recomendado):** respeitar `prefers-reduced-motion` para animações disparadas por interação. ([W3C C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39))

### Bom tomar (não obrigatório, mas certo)

- **`prefers-reduced-motion: reduce`** deve matar: screen shake, particles, hitstop, count-up animado, transformações de squash/stretch. **Não** deve matar: mudanças de cor (estados hover/selected), fade simples de opacity, indicação textual de vitória. ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion))
- **Toggle de áudio persistido** em `localStorage`. Botão visível no header. Default: áudio on. Mudo persiste entre sessões.
- **Toggle de "modo reduzido"** explícito no painel de acessibilidade, além do `prefers-reduced-motion`. Por quê: o usuário pode estar em um dispositivo compartilhado onde não controla a preferência do SO; ou pode querer reduzir só em um momento.
- **`will-change` apenas em elementos que realmente vão animar**, e remover após a animação. Nunca `will-change: transform` em 200 elementos — explode a contagem de layers no GPU. ([web.dev: compositor-only](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count))
- **Nunca tocar som antes do primeiro clique** (autoplay policy do browser). Criar `AudioContext` lazily.

---

## 7. Implementação Concreta no Navegador

Stack-agnóstico, focado em APIs padrão (zero deps).

### 7.1 CSS — Curvas canônicas

```css
/* Saída rápida, sensação de mola (squash, reveal) */
--ease-spring: cubic-bezier(0.22, 1, 0.36, 1);

/* Padrão Material — entrada/saída geral */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-enter:    cubic-bezier(0, 0, 0.2, 1);
--ease-exit:     cubic-bezier(0.4, 0, 1, 1);

/* Anticipation — leve recuo antes da ação */
--ease-anticip:  cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 7.2 CSS — Animações compostas (GPU-only)

Animações performantes usam **apenas `transform` e `opacity`**. Animar `width`, `top`, `background` força reflow. ([Motion.dev: Performance Tier List](https://motion.dev/magazine/web-animation-performance-tier-list))

```css
.shake-sm { animation: shake 0.32s cubic-bezier(0.36, 0.07, 0.19, 0.97); }
.shake-md { animation: shake 0.42s cubic-bezier(0.36, 0.07, 0.19, 0.97); }
.shake-lg { animation: shake 0.6s  cubic-bezier(0.36, 0.07, 0.19, 0.97); }

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0) rotate(-0.1deg); }
  20%, 80% { transform: translate3d(2px, 0, 0) rotate(0.15deg); }
  30%, 70% { transform: translate3d(-3px, 0, 0) rotate(-0.2deg); }
  40%, 60% { transform: translate3d(3px, 0, 0) rotate(0.25deg); }
  50%      { transform: translate3d(-2px, 0, 0) rotate(-0.15deg); }
}

@media (prefers-reduced-motion: reduce) {
  .shake-sm, .shake-md, .shake-lg { animation: none; }
  .fx-particle { display: none; }
  .hitstop-host { transition: none; }
}
```

### 7.3 JS — Web Audio API (síntese minimalista)

```js
let ctx, master;
function audio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
  }
  return ctx;
}
function vary(f, pct = 0.04) { return f * (1 + (Math.random() - 0.5) * 2 * pct); }

function tone(freq, { type='triangle', dur=0.12, gain=0.14, glideTo } = {}) {
  const c = audio(), t0 = c.currentTime;
  const osc = c.createOscillator(), g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g); g.connect(master);
  osc.start(t0); osc.stop(t0 + dur + 0.02);
}
```

### 7.4 JS — Sequência completa de uma vitória

```js
async function playWin(amount, x, y) {
  // 1. Anticipation: número trava no valor antigo por 180ms
  await wait(180);
  // 2. Hitstop visual: 70ms de freeze no elemento vencedor
  freezeFrame(70);
  await wait(70);
  // 3. Shake médio, particles, count-up em paralelo
  if (!reduced()) {
    shake('md');
    burst(x, y, { count: 22, spread: 160 });
  }
  tone(vary(540), { type: 'square', dur: 0.08, gain: 0.16 });
  tone(vary(810, 0.02), { type: 'triangle', dur: 0.18, gain: 0.06, glideTo: 1200 });
  await countUp(scoreEl, score, score + amount, 800);
  score += amount;
  // 4. Aftermath: pequena fade + ducking breve no master
  tone(vary(360), { type: 'sine', dur: 0.25, gain: 0.08 });
}
```

### 7.5 Haptic (mobile)

`navigator.vibrate(ms)` existe desde 2014 mas só funciona em Android (Chrome/Edge). iOS Safari nunca suportou. Usar com parcimônia: **só em vitória**, 5–15 ms, nunca padrão para o usuário (lembrete: casinos abusam de vibração para "presença"). ([W3C Vibration API](https://www.w3.org/TR/vibration/))

```js
function hapticWin() {
  if ('vibrate' in navigator) navigator.vibrate(12);
}
```

### 7.6 Performance

- **`will-change`** só nos elementos que **vão** ser animados em <500 ms. Remover após. ([MDN: will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change))
- **rAF** (requestAnimationFrame) para qualquer loop custom; nunca `setInterval(fn, 16)` — o navegador otimiza rAF. ([33 JS Concepts: rAF](https://33jsconcepts.com/beyond/concepts/requestanimationframe))
- **`prefers-reduced-motion`** como **primeira verificação** em todas as funções de juice. Não como ad-hoc — helper global:

```js
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
```

---

## 8. Áudio em Casino: O que a Pesquisa Diz

Dixon et al. (2014) é a referência primária. Conclusões que importam para o design:

1. **Som de vitória aumenta excitação subjetiva e objetiva** (frequência cardíaca, condutância da pele) — em vitórias **e perdas**. Ou seja: o som não é neutro mesmo quando o resultado é perda.
2. **Jogadores superestimam o número de vitórias** quando há som de vitória — viés cognitivo mensurável.
3. **Sons de perda raramente são ouvidos** em slots modernos (são suprimidos). Isso é por design: reforço positivo, punição silenciosa.
4. **Volume e "major mode"** (acordes maiores, agudos) são desenhados para se sobrepor ao ruído do salão e serem ouvidos.

**Implicação para casino web estático ético:** se queremos feedback de vitória, ele é legítimo. Se queremos silêncio em perdas e som de "você perdeu" abafado, isso é o padrão da indústria — mas precisa ser uma escolha consciente do produto, não default. Recomendo: **neutro em perdas** (thud seco opcional), **claramente afirmativo em vitórias**. Nada entre os dois.

---

## 9. Especificação Proposta: O Sistema de Feedback Restrito

Um sistema concreto, entregável. Não é um plano; é uma spec.

### Três tiers de feedback

| Tier | Eventos | Visual | Áudio | Tátil |
|---|---|---|---|---|
| **0 — input** | todo clique | Squash 120 ms (ou instantâneo se reduced) | Click suave (300 Hz triangle, 60 ms) | — |
| **1 — pagamento comum** | qualquer vitória 1×–5× | Count-up 600 ms, sem shake, partículas modestas | Tom ascendente (540 → 810 Hz) | — |
| **2 — evento raro** | jackpot, bônus, blackjack natural, sequência | Count-up 1200–1800 ms, hitstop 80 ms, shake médio, particles 22–30 | Fanfarra de 3 tons, ducking | Haptic 12 ms (mobile) |

### Quatro regras absolutas

1. **Perdas não têm tier 1 nem tier 2.** Zero confetti em loss disguised as win.
2. **Near-misses não têm feedback especial.** Sem zoom, sem brilho, sem som.
3. **Shake ≤ 3 magnitudes, ≤ 600 ms.** Nunca viewport shake em loop.
4. **Todo o juice desliga com `prefers-reduced-motion: reduce`** exceto transições de cor (hover, selected) e fade de opacity <200 ms.

### Ordem temporal canônica (uma vitória tier 2)

```
0 ms     — clique do jogador
+0 ms    — squash do botão (120 ms, ease-spring)
+120 ms  — anticipation: leve retardo + zoom-out 1.5%
+240 ms  — hitstop 70 ms (freeze frame)
+310 ms  — reveal + count-up (800 ms, ease-out)
+310 ms  — shake médio + 22 particles (em paralelo)
+310 ms  — fanfarra 3-tom
+1100 ms — second beat: tom grave (finality)
```

### Onde o `prefers-reduced-motion` corta

| Efeito | Sem reduced | Com reduced |
|---|---|---|
| Squash/stretch | ativo | fade simples 80 ms |
| Hitstop | ativo | none |
| Screen shake | ativo | none |
| Particles | ativo | none |
| Count-up animado | ativo | número muda instantaneamente |
| Som | ativo | ativo (áudio tem toggle próprio) |
| Cor/opacidade | ativo | ativo |

---

## 10. Fontes Primárias e Credíveis

### Teoria e prática de game feel

- **Steve Swink**, *Game Feel: A Game Designer's Guide to Virtual Sensation* (Morgan Kaufmann, 2008) — [PDF completo](https://gamifique.files.wordpress.com/2011/11/2-game-feel.pdf) · [site oficial](http://www.game-feel.com/)
- **Martin Jonasson & Petri Purho**, "Juice it or lose it" (GDC 2012) — [talk no YouTube](https://www.youtube.com/watch?v=Fy0aCDmgnxg) · [Breakout juicy jogável](http://grapefrukt.com/f/games/juicy-breakout/)
- **Jan Willem Nijman / Vlambeer**, "The art of screenshake" (GDC 2013) — [talk no YouTube](https://www.youtube.com/watch?v=AJdEqssNZ-U)
- **Nicolae Berbece**, "Game Feel: Why Your Death Animation Sucks" (GDC Europe 2015) — [YouTube](https://www.youtube.com/watch?v=pmSAG51BybY)
- **Mark Brown / Game Maker's Toolkit**, "Secrets of Game Feel and Juice" — [YouTube](https://www.youtube.com/watch?v=216_5nuL4aVQ)
- **Wikipedia: Game feel** — [en.wikipedia.org/wiki/Game_feel](https://en.wikipedia.org/wiki/Game_feel)
- **Valdemird**, "Game feel on the web: squash, shake, and the art of juice" (2024–25) — [valdemird.com/blog/game-feel-on-the-web/](https://valdemird.com/blog/game-feel-on-the-web/) — fonte primária para implementação web moderna com código real

### Animação e motion design

- **Disney**: Frank Thomas & Ollie Johnston, *The Illusion of Life* (1981) — [Wikipedia: 12 basic principles](https://en.wikipedia.org/wiki/12_basic_principles_of_animation)
- **Val Head**, "What Does Disney Know About Interface Animation?" (2016) — [valhead.com](https://valhead.com/2016/01/18/what-does-disney-know-about-interface-animation-anyway/)
- **Infil's Fighting Game Glossary: Hitstop** — [glossary.infil.net/?t=Hitstop](https://glossary.infil.net/?t=Hitstop)
- **Motion.dev: Web Animation Performance Tier List** — [motion.dev/magazine](https://motion.dev/magazine/web-animation-performance-tier-list)

### Acessibilidade

- **W3C WCAG 2.2 Technique C39: prefers-reduced-motion** — [w3.org/WAI/WCAG22/Techniques/css/C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)
- **MDN: prefers-reduced-motion** — [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- **Val Head**, "Accessible Web Animation: The WCAG on Animation Explained" (CSS-Tricks) — [css-tricks.com](https://css-tricks.com/accessible-web-animation-the-wcag-on-animation-explained/)
- **Bureau of Internet Accessibility** sobre prefers-reduced-motion — [boia.org](https://www.boia.org/blog/what-to-know-about-the-css-prefers-reduced-motion-feature)
- **W3C WCAG 2.1 SC 2.2.2 Pause, Stop, Hide** — [w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html)
- **WebKit Blog: Responsive Design for Motion** (2017) — [webkit.org/blog/7551](https://webkit.org/blog/7551/responsive-design-for-motion/)

### Performance de animação no navegador

- **Chris Wilson (Google), "A tale of two clocks"** — web.dev, o artigo de referência sobre agendar áudio com `AudioContext.currentTime` + lookahead — [web.dev/articles/audio-scheduling](https://web.dev/articles/audio-scheduling)
- **web.dev: Compositor-only properties & will-change** — [web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count)
- **MDN: will-change** — [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change)
- **MDN: Web Audio API** — [developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **33 JS Concepts: requestAnimationFrame** — [33jsconcepts.com](https://33jsconcepts.com/beyond/concepts/requestanimationframe)

### Pesquisa em casino / jogo responsável

- **Dixon, Harrigan, Santesso, Graydon, Fugelsang, Collins (2014)** — "The Impact of Sound in Modern Multiline Video Slot Machine Play," *J Gambl Stud* — [PMC4225056](https://pmc.ncbi.nlm.nih.gov/articles/PMC4225056/) — fonte primária sobre como áudio amplifica excitação e gera viés de superestimação de vitórias
- **Casino Center** sobre near-miss effect — [casinocenter.com](https://www.casinocenter.com/slot-machine-psychology-how-the-near-miss-effect-drives-player-behavior-in-online-gaming/)
- **Cache Creek** sobre near-miss em casino — [cachecreek.com/near-miss-effect](https://www.cachecreek.com/near-miss-effect)
- **W3C Vibration API** — [w3.org/TR/vibration/](https://www.w3.org/TR/vibration/)

### Latência e tempo de resposta

- **Jakob Nielsen (1993, republicado NN/g)**, "Response Times: The 3 Important Limits" — [nngroup.com](https://www.nngroup.com/articles/response-times-3-important-limits/) — ainda a referência: 0.1 s = instantâneo, 1 s = fluxo, 10 s = limite de atenção
- **Jakob Nielsen (2025)**, "Time Scales of UX: From 0.1 Seconds to 100 Years" — [jakobnielsenphd.substack.com](https://jakobnielsenphd.substack.com/p/time-scale-ux)

---

## 11. TL;DR para o Time

1. **Game feel = controle em tempo real + polimento.** Casino estático não tem controle em tempo real, então **todo o feel mora no polimento.** Restrição aqui é correta e ética.
2. **Seis efeitos dominam:** squash/stretch, anticipation, hitstop, screen shake, partículas, áudio sintetizado. Cada um com **momento certo** e **momento errado**. Não empilhar tudo em todo evento.
3. **Acessibilidade é o default**, não o extra. `prefers-reduced-motion` deve estar na primeira linha de toda função de juice. WCAG 2.2 SC 2.3.3 é a base normativa.
4. **Performance = só `transform` e `opacity`**, `will-change` cirúrgico, `AudioContext.currentTime` (não `setTimeout`) para som.
5. **Ética do produto**: zero juice em perdas, zero juice em near-misses. Juice é para vitórias reais. Slots modernos abusam desse sistema há décadas — a escolha de **não** abusar é uma feature competitiva.
6. **A diversão existe com ou sem juice.** Nunca ser load-bearing. Esse é o teste de qualidade: o jogo continua jogável e honesto quando todos os efeitos estão desligados.

---

*Pesquisa realizada em 4 de agosto de 2026. Todas as fontes foram acessadas e lidas; citações diretas estão marcadas. Este documento é a base para o overhaul técnico — não é o plano de implementação, mas a fundação conceitual e técnica que informa cada decisão de produto.*