<script lang="ts">
  import { ROULETTE_CHIP_OPTIONS, ROULETTE_MAX_ROUNDS, ROULETTE_TARGETS, ACT_COUNT, STARTING_BALANCE, STARTING_LIVES } from '$lib/game/config';
  import { LUCKY_HOUSE_COST, LUCKY_HOUSE_CHANCE } from '$lib/game/config';
  import { randomNumber, settle, numberToAngle, type Bet, type BetType, color, type RouletteColor } from '$lib/game/roulette';
  import { applyTalismans, applyModsToBalance, ROULETTE_CATALOG } from '$lib/game/roulette-talismans';
  import { SC_REDS } from '$lib/game/roulette-data';
  import RunHud from '$lib/components/RunHud.svelte';
  import TalismanPanel from '$lib/components/TalismanPanel.svelte';
  import History from '$lib/components/History.svelte';
  import Shop from '$lib/components/Shop.svelte';
  import Breakdown from '$lib/components/Breakdown.svelte';
  import { tone, celebrate, getSound, setSound } from '$lib/effects/audio';
  import { ballTrail, flashNumber, luckyActivated } from '$lib/effects/juice';

  interface HistoryEntry { label: string; value: string }
  interface EndState { visible: boolean; win: boolean; balance: number; act: number }

  const targets = ROULETTE_TARGETS;
  let balance = $state(STARTING_BALANCE + 50);
  let act = $state(0);
  let lives = $state(STARTING_LIVES);
  let rounds = $state(0);
  let actStart = $state(STARTING_BALANCE + 50);
  let chip = $state(5);
  let bets = $state<Map<string, Bet>>(new Map());
  let spinning = $state(false);
  let rotation = $state(0);
  let relics = $state<string[]>([]);
  let consumables = $state<{ luckyHouse: 0 | 1 }>({ luckyHouse: 0 });
  let luckyHouseActive = $state(false);
  let lastBets: Map<string, Bet> | null = $state<Map<string, Bet> | null>(null);
  let streak = $state(0);
  let dozenStreak = $state(0);
  let weightUsed = $state(false);
  let message = $state('Escolha uma ficha e monte sua aposta.');
  let notes = $state<string[]>([]);
  let history = $state<HistoryEntry[]>([]);
  let shopOpen = $state(false);
  let endState = $state<EndState>({ visible: false, win: false, balance: 0, act: 0 });
  let soundOn = $state(getSound());
  let resultNumber = $state<number | null>(null);
  let resultColor = $state<RouletteColor | null>(null);
  let lastResultNumber = $state<number | null>(null);
  let numberEl: HTMLElement | null = $state(null);

  let profit = $derived(balance - actStart);
  let total = $derived([...bets.values()].reduce((acc, b) => acc + b.amount, 0));
  let lastTotal = $derived(lastBets ? [...lastBets.values()].reduce((a, b) => a + b.amount, 0) : 0);

  const betKey = (t: string, v: string) => `${t}:${v}`;
  const betsArr = $derived([...bets.values()]);

  function reset() {
    balance = STARTING_BALANCE + 50;
    act = 0;
    lives = STARTING_LIVES;
    rounds = 0;
    actStart = balance;
    chip = 5;
    bets = new Map();
    spinning = false;
    rotation = 0;
    relics = [];
    consumables = { luckyHouse: 0 };
    luckyHouseActive = false;
    lastBets = null;
    streak = 0;
    dozenStreak = 0;
    weightUsed = false;
    message = 'Escolha uma ficha e monte sua aposta.';
    notes = [];
    history = [];
    shopOpen = false;
    endState = { visible: false, win: false, balance: 0, act: 0 };
    resultNumber = null;
    resultColor = null;
    lastResultNumber = null;
  }

  function repeatLast() {
    if (!lastBets) return;
    if (balance < lastTotal) return;
    bets = new Map(lastBets);
    message = `Apostas repetidas: ◆ ${lastTotal} no total.`;
    tone(550, 0.1, 'sine');
  }

  function betKeyFor(type: BetType, value: string) { return betKey(type, value); }

  function place(type: BetType, value: string) {
    if (spinning) return;
    if (balance < chip) { message = 'Fichas insuficientes.'; return; }
    const key = betKeyFor(type, value);
    balance -= chip;
    const next = new Map(bets);
    const current = next.get(key);
    next.set(key, { type, value, amount: (current?.amount ?? 0) + chip });
    bets = next;
    message = `◆ ${chip} adicionadas à aposta.`;
    tone(390 + chip * 2);
  }

  function clear() {
    balance += total;
    bets = new Map();
    message = 'Apostas devolvidas.';
    tone(260);
  }

  function spin() {
    if (spinning || !bets.size) return;
    spinning = true;
    rounds++;
    notes = [];
    message = 'A órbita está em movimento…';
    const number = randomNumber();
    const jitter = (crypto.getRandomValues(new Uint32Array(1))[0]! % 100) / 100 * 4 - 2;
    rotation = 1440 + numberToAngle(number) + jitter;
    setTimeout(() => settle2(number), matchReducedMotion() ? 20 : 2450);
  }

  function matchReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function settle2(number: number) {
    const s = settle(number, betsArr, luckyHouseActive);
    const wasLucky = luckyHouseActive;
    luckyHouseActive = false;
    const mods = applyTalismans(s, { relics, streak, dozenStreak });
    let bonus = mods.bonus;
    if (s.net > 0) {
      streak++;
    } else {
      streak = 0;
      if (s.net < 0 && !weightUsed && relics.includes('weight')) {
        bonus += 10;
        mods.notes.push('Contrapeso +10');
        weightUsed = true;
      }
    }
    const { net, extra } = applyModsToBalance(mods, s.net);
    balance += s.returned + bonus + extra;
    lastBets = bets.size > 0 ? new Map(bets) : lastBets;
    if (wasLucky && s.luckyMultiplier > 1 && s.net > 0) {
      mods.notes.push(`Casa-Sorte ×${s.luckyMultiplier}`);
    }
    if (s.net > 0) {
      if (s.dozenWin) dozenStreak += 1;
      else dozenStreak = 0;
    } else {
      dozenStreak = 0;
    }
    notes = [`Base ${s.net >= 0 ? '+' : ''}${s.net}`, ...mods.notes];
    const entry: HistoryEntry = {
      label: `${number} · aposta ${s.staked}`,
      value: `${net >= 0 ? '+' : ''}${net}`
    };
    history = [entry, ...history].slice(0, 6);
    if (net > 0) {
      const target = document.querySelector('.stage') as HTMLElement | null;
      celebrate(target, net >= 100);
      flashNumber(numberEl);
    }
    resultNumber = number;
    resultColor = color(number);
    lastResultNumber = number;
    setTimeout(() => { lastResultNumber = null; }, 2500);
    message = net > 0
      ? `Lucro líquido de ◆ ${net}.`
      : net === 0
        ? 'Retorno igual à aposta. Sem lucro.'
        : `Perda líquida de ◆ ${-net}.`;
    if (numberEl) {
      const rect = numberEl.getBoundingClientRect();
      ballTrail(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    bets = new Map();
    spinning = false;
    setTimeout(checkAct, 350);
  }

  function checkAct() {
    if (profit >= targets[act]!) {
      if (act === ACT_COUNT - 1) {
        endState = { visible: true, win: true, balance, act };
        return;
      }
      shopOpen = true;
      return;
    }
    if (rounds >= ROULETTE_MAX_ROUNDS || balance < 5) {
      lives--;
      if (!lives) {
        endState = { visible: true, win: false, balance, act };
        return;
      }
      rounds = 0;
      actStart = balance;
      weightUsed = false;
      dozenStreak = 0;
      streak = 0;
      consumables = { luckyHouse: 0 };
      luckyHouseActive = false;
      message = 'O ato falhou. Vida consumida; tente o ato novamente.';
    }
  }

  function buyRelic(relic: { id: string; cost: number; name: string; text: string }) {
    if (relics.length >= 3) return;
    if (balance < relic.cost) return;
    balance -= relic.cost;
    relics = [...relics, relic.id];
    shopOpen = false;
    act++;
    rounds = 0;
    actStart = balance;
    weightUsed = false;
    dozenStreak = 0;
    streak = 0;
    consumables = { luckyHouse: 0 };
    luckyHouseActive = false;
    message = 'Novo ato. Monte sua exposição.';
  }

  function skipShop() {
    shopOpen = false;
    act++;
    rounds = 0;
    actStart = balance;
    weightUsed = false;
    dozenStreak = 0;
    streak = 0;
    consumables = { luckyHouse: 0 };
    luckyHouseActive = false;
    message = 'Novo ato. Monte sua exposição.';
  }
  function setChip(v: number) {
    chip = v;
    tone(430);
  }

  function betChipColor(amount: number): string {
    if (amount === 5) return 'var(--chip-5)';
    if (amount === 10) return 'var(--chip-10)';
    if (amount === 25) return 'var(--chip-25)';
    return 'var(--chip-50)';
  }

  function chipStackFor(betKey: string): number[] {
    const bet = bets.get(betKey);
    if (!bet) return [];
    const totalChips = betsForStack(bet);
    if (totalChips.length <= 5) return totalChips;
    return [...totalChips.slice(0, 4), -1];
  }

  function betsForStack(bet: Bet): number[] {
    const out: number[] = [];
    let remaining = bet.amount;
    for (const denom of [50, 25, 10, 5]) {
      while (remaining >= denom) {
        out.push(denom);
        remaining -= denom;
      }
    }
    return out;
  }

  function toggleSound() {
    setSound(!soundOn);
    soundOn = !soundOn;
  }

  function useLuckyHouse() {
    if (consumables.luckyHouse === 0 || luckyHouseActive || spinning) return;
    luckyHouseActive = true;
    consumables = { luckyHouse: 0 };
    const target = document.querySelector('.stage') as HTMLElement | null;
    luckyActivated(target);
    message = 'Casa-Sorte preparada. Zero paga ×5 e externas pagam 1:1.';
    tone(700, 0.12, 'triangle');
  }

  function rollLuckyHouse(): boolean {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0]! / 2 ** 32 < LUCKY_HOUSE_CHANCE;
  }

  function buyLuckyHouse() {
    if (consumables.luckyHouse === 1) return;
    if (balance < LUCKY_HOUSE_COST) return;
    balance -= LUCKY_HOUSE_COST;
    consumables = { luckyHouse: 1 };
    message = 'Casa-Sorte comprada. Use antes da próxima rodada.';
    tone(660, 0.1, 'sine');
  }

  function isRed(n: number): boolean { return SC_REDS.has(n); }
  function isBlack(n: number): boolean { return n !== 0 && !SC_REDS.has(n); }
</script>

<main class="game-shell">
  <header class="topbar">
    <div class="brand">
      <a href="#/">← Salão</a>
      <h1>Órbita 37</h1>
    </div>
    <div class="hud">
      <div class="stat">Ato<strong>{act + 1} / {ACT_COUNT}</strong></div>
      <div class="stat">Fichas<strong>◆ {balance}</strong></div>
      <div class="stat">Giros<strong>{rounds} / {ROULETTE_MAX_ROUNDS}</strong></div>
    </div>
    <button class="sound-toggle" onclick={toggleSound} aria-label="Alternar som">{soundOn ? '♪' : '×'}</button>
    <button
      class="sound-toggle"
      onclick={repeatLast}
      disabled={!lastBets || spinning || (lastBets && balance < lastTotal)}
      title={!lastBets
        ? 'Sem apostas anteriores'
        : balance < lastTotal
          ? 'Saldo insuficiente'
          : 'Repetir última aposta'}
    >↺ Repetir</button>
  </header>

  <div class="layout">
    <aside class="sidebar">
      <RunHud act={act} actCount={ACT_COUNT} profit={profit} target={targets[act]!} lives={lives} livesMax={STARTING_LIVES} />
      <TalismanPanel relics={relics} catalog={ROULETTE_CATALOG} />
      <section class="panel consumable-panel">
        <p class="eyebrow">Consumível</p>
        {#if consumables.luckyHouse === 1}
          <div class="consumable-ready">
            <strong>Casa-Sorte</strong>
            <small>Zero paga ×5 e externas pagam 1:1.</small>
            <button class="primary" onclick={useLuckyHouse} disabled={spinning || luckyHouseActive}>
              {luckyHouseActive ? 'Ativa na próxima rodada' : 'Usar antes de girar'}
            </button>
          </div>
        {:else}
          <span class="empty">Nenhum.</span>
        {/if}
      </section>
      <History history={history} />
    </aside>

    <section class="stage">
      <div class="roulette-grid">
        <section class="wheel-zone">
          <div class="wheel-shell">
            <span class="pointer"></span>
            <div class="wheel" style="transform: rotate({rotation}deg)"></div>
          </div>
          <output class="result" bind:this={numberEl} class:number-flash={resultNumber !== null} class:red={resultColor === 'red'} class:black={resultColor === 'black'} class:green={resultColor === 'green'}>
            {resultNumber === null ? '—' : resultNumber}
          </output>
          <p class="message" role="status" aria-live="polite">{message}</p>
          <Breakdown notes={notes} />
        </section>

        <section class="table">
          <p class="eyebrow">Número cheio · 35:1</p>
          <div class="numbers">
            <button
              class="number zero"
              class:bet={bets.get('number:0')?.amount}
              class:chip-pop={bets.get('number:0')?.amount}
              class:last-result={lastResultNumber === 0}
              onclick={() => place('number', '0')}
            >0
              {#if bets.get('number:0')?.amount}
                <span class="chip-stack">
                  {#each chipStackFor('number:0') as chip, i}
                    {#if chip === -1}
                      <i class="chip-overflow" style="z-index: {i}">+{bets.get('number:0')!.amount - 4 * 50 - 25}</i>
                    {:else}
                      <i class="chip" data-value={chip} style="z-index: {i}; background: {betChipColor(chip)}"></i>
                    {/if}
                  {/each}
                </span>
              {/if}
            </button>
            {#each Array.from({ length: 36 }, (_, i) => i + 1) as n}
              <button
                class="number"
                class:red={isRed(n)}
                class:black={isBlack(n)}
                class:bet={bets.get(`number:${n}`)?.amount}
                class:chip-pop={bets.get(`number:${n}`)?.amount}
                class:last-result={lastResultNumber === n}
                onclick={() => place('number', String(n))}
                disabled={spinning}
              >{n}
                {#if bets.get(`number:${n}`)?.amount}
                  <span class="chip-stack">
                    {#each chipStackFor(`number:${n}`) as chip, i}
                      {#if chip === -1}
                        <i class="chip-overflow" style="z-index: {i}">+{bets.get(`number:${n}`)!.amount - 4 * 50 - 25}</i>
                      {:else}
                        <i class="chip" data-value={chip} style="z-index: {i}; background: {betChipColor(chip)}"></i>
                      {/if}
                    {/each}
                  </span>
                {/if}
              </button>
            {/each}
          </div>
          <div class="dozens">
            <button class="option" onclick={() => place('dozen', '1')}>1ª dúzia · 2:1</button>
            <button class="option" onclick={() => place('dozen', '2')}>2ª dúzia · 2:1</button>
            <button class="option" onclick={() => place('dozen', '3')}>3ª dúzia · 2:1</button>
          </div>
          <div class="outside">
            <button class="option" onclick={() => place('low', '')}>1–18</button>
            <button class="option" onclick={() => place('even', '')}>Par</button>
            <button class="option red" onclick={() => place('color', 'red')}>Vermelho</button>
            <button class="option" onclick={() => place('color', 'black')}>Preto</button>
            <button class="option" onclick={() => place('odd', '')}>Ímpar</button>
            <button class="option" onclick={() => place('high', '')}>19–36</button>
          </div>
          <div class="chips">
            {#each ROULETTE_CHIP_OPTIONS as value}
              <button class="chip" data-value={String(value)} class:selected={chip === value} onclick={() => setChip(value)}>{value}</button>
            {/each}
            <span class="total">Na mesa: <b>◆ {total}</b></span>
          </div>
          <div class="actions">
            <button onclick={clear} disabled={!total || spinning}>Limpar</button>
            <button class="primary" onclick={spin} disabled={!total || spinning}>Girar</button>
          </div>
          <p class="disclaimer">Roleta europeia: 37 resultados equiprováveis. Talismãs alteram recompensas, nunca o sorteio. Créditos virtuais, sem compra ou saque.</p>
        </section>
      </div>
    </section>
  </div>
</main>

{#if shopOpen}
  <Shop
    relics={relics}
    catalog={ROULETTE_CATALOG}
    consumable={consumables.luckyHouse === 0 && rollLuckyHouse()
      ? { id: 'luckyHouse', name: 'Casa-Sorte', text: 'Próxima rodada: zero paga ×5 e externas pagam 1:1.', cost: LUCKY_HOUSE_COST }
      : null}
    onbuy={buyRelic}
    onbuyConsumable={buyLuckyHouse}
    onskip={skipShop}
    canafford={(cost: number) => balance >= cost}
  />
{/if}

{#if endState.visible}
  <div class="overlay">
    <section class="card">
      <p class="eyebrow">Fim da expedição</p>
      <h2>{endState.win ? 'A Órbita se abre' : 'A Casa venceu'}</h2>
      <p>{endState.win ? `Cinco atos concluídos com ◆ ${endState.balance}.` : `Fim no ato ${endState.act + 1}, com ◆ ${endState.balance}.`}</p>
      <div class="shop-actions">
        <a href="#/"><button>Salão</button></a>
        <button class="primary" onclick={reset}>Nova expedição</button>
      </div>
    </section>
  </div>
{/if}

<style>
  .game-shell { max-width: 1180px; margin: 0 auto; min-height: 100svh; padding: clamp(14px, 3vw, 30px); }
  .topbar { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
  .brand { display: flex; align-items: baseline; gap: 12px; }
  .brand a { color: var(--muted); text-decoration: none; }
  .brand h1 { margin: 0; color: var(--gold); font-size: clamp(1.25rem, 4vw, 2rem); letter-spacing: 0.15em; text-transform: uppercase; }
  .hud { display: flex; gap: 14px; }
  .stat { color: var(--muted); font: 700 0.63rem system-ui, sans-serif; letter-spacing: 0.12em; text-align: right; text-transform: uppercase; }
  .stat strong { display: block; color: var(--cream); font: 700 1.05rem Georgia, serif; letter-spacing: 0; }
  .sound-toggle { background: transparent; border: 1px solid var(--line); color: var(--cream); padding: 6px 10px; cursor: pointer; font: 700 0.8rem system-ui, sans-serif; }
  .sound-toggle:hover { filter: brightness(1.2); }
  .layout { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 22px; padding-top: 20px; align-items: start; }
  .sidebar { display: grid; align-content: start; gap: 14px; }
  .stage { min-width: 0; }
  .roulette-grid { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 24px; align-items: start; }
  .wheel-zone { display: grid; justify-items: center; gap: 14px; }
  .wheel-shell { position: relative; width: 230px; aspect-ratio: 1; display: grid; place-items: center; }
  .pointer { position: absolute; z-index: 3; top: -7px; border: 12px solid transparent; border-top: 22px solid var(--gold); filter: drop-shadow(0 2px 2px #000); }
  .wheel { width: 100%; height: 100%; border: 9px solid #826127; border-radius: 50%; background: repeating-conic-gradient(from -4.865deg, #972c35 0 9.73deg, #151b19 9.73deg 19.46deg); box-shadow: 0 0 0 3px var(--gold), 0 15px 35px rgb(0 0 0 / 0.5), inset 0 0 0 8px rgb(255 255 255 / 0.09); transition: transform 2.4s cubic-bezier(0.12, 0.68, 0.16, 1); }
  .wheel::after { content: ""; position: absolute; inset: 42%; border: 4px solid #66481d; border-radius: 50%; background: var(--gold); box-shadow: 0 0 0 6px var(--cream); }
  .result { display: grid; place-items: center; width: 54px; height: 54px; border: 2px solid var(--gold); border-radius: 50%; background: var(--felt-2); font: 700 1.7rem system-ui, sans-serif; transition: background 0.3s ease; }
  .result.red { background: var(--wine); }
  .result.black { background: var(--ink); }
  .result.green { background: var(--felt-2); }
  .message { min-height: 1.5em; margin: 8px 0; text-align: center; font: 700 0.9rem system-ui, sans-serif; }
  .table { min-width: 0; }
  .eyebrow { margin: 0 0 8px; color: var(--muted); font: 700 0.64rem system-ui, sans-serif; letter-spacing: 0.15em; text-transform: uppercase; }
  .consumable-ready strong { display: block; color: var(--gold); font: 700 0.85rem Georgia, serif; }
  .consumable-ready small { display: block; margin-top: 4px; color: var(--muted); font: 400 0.68rem/1.3 system-ui, sans-serif; }
  .consumable-ready button { margin-top: 10px; width: 100%; }
  .empty { color: var(--muted); font: italic 0.78rem Georgia, serif; }
  .numbers { display: grid; grid-template-columns: repeat(12, 1fr); gap: 3px; position: relative; }
  .number, .option { position: relative; min-width: 0; padding: 7px 3px; background: var(--ink); color: var(--cream); border: 1px solid var(--line); border-radius: 4px; font: 700 0.8rem system-ui, sans-serif; cursor: pointer; overflow: visible; }
  .number.red, .option.red { background: var(--wine); }
  .number.zero { grid-column: 1 / -1; background: var(--felt-2); border-color: var(--gold); }
  .option:disabled, .number:disabled { opacity: 0.4; cursor: not-allowed; }
  .chip-stack { position: absolute; top: 2px; right: 2px; display: flex; flex-direction: column-reverse; gap: 1px; align-items: flex-end; pointer-events: none; }
  .chip-stack .chip { display: block; width: 10px; height: 10px; border-radius: 50%; border: 1.5px dashed rgb(255 255 255 / 0.55); box-shadow: 0 0 2px rgb(0 0 0 / 0.5); }
  .chip-stack .chip-overflow { display: block; min-width: 16px; height: 10px; padding: 0 3px; border-radius: 5px; background: var(--cyan); color: var(--ink); font: 700 0.55rem system-ui, sans-serif; line-height: 10px; text-align: center; box-shadow: 0 0 2px rgb(0 0 0 / 0.5); }
  .dozens { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; margin-top: 3px; }
  .outside { display: grid; grid-template-columns: repeat(6, 1fr); gap: 3px; margin-top: 3px; }
  .chips, .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-top: 13px; }
  .chip { width: 46px; height: 46px; min-height: 46px; padding: 0; border: 3px dashed rgb(255 255 255 / 0.55); border-radius: 50%; background: #89682e; color: var(--cream); font: 700 0.9rem system-ui, sans-serif; cursor: pointer; }
  .chip[data-value="10"] { background: #285a87; }
  .chip[data-value="25"] { background: #96343c; }
  .chip[data-value="50"] { background: #3c2d62; }
  .chip.selected { outline: 3px solid var(--cream); outline-offset: 2px; transform: translateY(-2px); }
  .total { margin-left: auto; color: var(--muted); font: 700 0.7rem system-ui, sans-serif; }
  .total b { color: var(--gold); font-size: 1rem; }
  .actions { gap: 8px; }
  .actions button { flex: 1; min-height: 44px; border: 1px solid var(--line); border-radius: 4px; padding: 9px 13px; color: var(--cream); background: #153d32; cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em; font: 700 0.8rem system-ui, sans-serif; }
  .actions .primary { color: #211b0f; background: var(--gold); border-color: var(--gold); }
  .actions button:hover:not(:disabled) { filter: brightness(1.14); transform: translateY(-1px); }
  .actions button:active:not(:disabled) { transform: translateY(2px) scale(0.98); }
  .disclaimer { margin: 10px 0 0; text-align: right; color: var(--muted); font: 0.66rem/1.4 system-ui, sans-serif; }
  .overlay { position: fixed; inset: 0; display: grid; place-items: center; padding: 20px; background: rgb(2 14 11 / 0.86); z-index: 30; }
  .card { width: min(100%, 760px); padding: 24px; border: 1px solid var(--gold); background: #082c24; box-shadow: 0 24px 80px #000; }
  .card h2 { margin: 0; color: var(--gold); letter-spacing: 0.12em; text-transform: uppercase; }
  .shop-actions { display: flex; justify-content: flex-end; gap: 8px; }
  .shop-actions button { min-height: 44px; border: 1px solid var(--line); border-radius: 4px; padding: 9px 13px; color: var(--cream); background: #123c31; cursor: pointer; }
  .shop-actions .primary { color: #211b0f; background: var(--gold); border-color: var(--gold); }
  @media (max-width: 880px) { .roulette-grid { grid-template-columns: 1fr; } .wheel-shell { width: 190px; } .numbers { grid-template-columns: repeat(6, 1fr); } .outside { grid-template-columns: repeat(3, 1fr); } .disclaimer { text-align: left; } }
  @media (max-width: 760px) { .layout { grid-template-columns: 1fr; } .sidebar { grid-template-columns: 1fr 1fr; } .sidebar :global(.panel:last-child) { grid-column: 1 / -1; } }
  @media (max-width: 440px) { .sidebar { grid-template-columns: 1fr; } .sidebar :global(.panel:last-child) { grid-column: auto; } .game-shell { padding: 12px; } .number { min-height: 42px; } .total { width: 100%; margin: 5px 0; } }
</style>
