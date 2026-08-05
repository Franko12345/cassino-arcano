<script lang="ts">
  import { makeDeck, shuffle } from '$lib/game/deck';
  import { BLACKJACK_BET_OPTIONS, BLACKJACK_MAX_ROUNDS, BLACKJACK_TARGETS, ACT_COUNT, STARTING_BALANCE, STARTING_LIVES } from '$lib/game/config';
  import { resolve, applyTalismans, BLACKJACK_CATALOG } from '$lib/game/blackjack-talismans';
  import { isNatural, type Card } from '$lib/game/blackjack';
  import { score } from '$lib/game/blackjack';
  import RunHud from '$lib/components/RunHud.svelte';
  import TalismanPanel from '$lib/components/TalismanPanel.svelte';
  import History from '$lib/components/History.svelte';
  import Shop from '$lib/components/Shop.svelte';
  import Breakdown from '$lib/components/Breakdown.svelte';
  import { tone, celebrate, getSound, setSound } from '$lib/effects/audio';
  import { confettiBurst } from '$lib/effects/juice';

  interface HistoryEntry { label: string; value: string }
  interface EndState { visible: boolean; win: boolean; balance: number; act: number }

  const targets = BLACKJACK_TARGETS;
  let balance = $state(STARTING_BALANCE);
  let act = $state(0);
  let lives = $state(STARTING_LIVES);
  let rounds = $state(0);
  let actStart = $state(STARTING_BALANCE);
  let bet = $state(20);
  let deck = $state<Card[]>([]);
  let player = $state<Card[]>([]);
  let dealer = $state<Card[]>([]);
  let active = $state(false);
  let hidden = $state(true);
  let relics = $state<string[]>([]);
  let streak = $state(0);
  let reserveUsed = $state(false);
  let message = $state('Escolha uma aposta para iniciar a expedição.');
  let notes = $state<string[]>([]);
  let history = $state<HistoryEntry[]>([]);
  let shopOpen = $state(false);
  let endState = $state<EndState>({ visible: false, win: false, balance: 0, act: 0 });
  let soundOn = $state(getSound());

  let profit = $derived(balance - actStart);
  let playerScore = $derived(score(player));
  let dealerScore = $derived(hidden ? null : score(dealer));

  function reset() {
    balance = STARTING_BALANCE;
    act = 0;
    lives = STARTING_LIVES;
    rounds = 0;
    actStart = STARTING_BALANCE;
    bet = 20;
    deck = [];
    player = [];
    dealer = [];
    active = false;
    hidden = true;
    relics = [];
    streak = 0;
    reserveUsed = false;
    message = 'Escolha uma aposta para iniciar a expedição.';
    notes = [];
    history = [];
    shopOpen = false;
    endState = { visible: false, win: false, balance: 0, act: 0 };
  }

  function deal() {
    if (active || balance < bet) return;
    notes = [];
    balance -= bet;
    deck = shuffle(makeDeck());
    player = [deck.pop()!, deck.pop()!];
    dealer = [deck.pop()!, deck.pop()!];
    active = hidden = true;
    rounds++;
    message = 'Pedir ou parar?';
    tone(260, 0.05, 'square');
    if (isNatural(player) || isNatural(dealer)) finishHand();
  }

  function hit() {
    if (!active) return;
    player = [...player, deck.pop()!];
    tone(300, 0.05, 'square');
    const s = score(player);
    if (s >= 21) s === 21 ? stand() : finishHand();
  }

  function stand() {
    if (!active) return;
    hidden = false;
    let d = [...dealer];
    while (score(d) < 17) d = [...d, deck.pop()!];
    dealer = d;
    finishHand();
  }

  function finishHand() {
    active = false;
    hidden = false;
    const outcome = resolve(player, dealer, bet);
    const mods = applyTalismans(outcome, { relics, streak });
    if (outcome.kind === 'loss' && !reserveUsed && relics.includes('reserve')) {
      mods.bonus += 10;
      mods.notes.push('Reserva +10');
      reserveUsed = true;
    }
    const baseProfit = (outcome.kind === 'win' ? bet : outcome.kind === 'blackjack' ? Math.floor(bet * 1.5) : outcome.kind === 'push' ? 0 : 0);
    const returned = Math.max(0, bet + baseProfit * mods.multiplier + (mods.bonus || 0));
    balance += returned;
    const net = returned - bet;
    streak = outcome.kind === 'win' || outcome.kind === 'blackjack' ? streak + 1 : 0;
    notes = [`${outcomeLabel(outcome.kind)}: ${net >= 0 ? '+' : ''}${net}`, ...mods.notes];
    const entry: HistoryEntry = {
      label: `${score(player)} × ${dealerScore ?? score(dealer)}`,
      value: `${net >= 0 ? '+' : ''}${net}`
    };
    history = [entry, ...history].slice(0, 6);
    if (net > 0) {
      const target = document.querySelector('.stage') as HTMLElement | null;
      celebrate(target, outcome.kind === 'blackjack' || net >= 75);
      confettiBurst(target);
    }
    message = messageForOutcome(outcome.kind, net);
    setTimeout(checkAct, 350);
  }

  function outcomeLabel(kind: string): string {
    if (kind === 'win') return 'Vitória';
    if (kind === 'blackjack') return 'Blackjack';
    if (kind === 'push') return 'Empate';
    return 'Derrota';
  }

  function messageForOutcome(kind: string, net: number): string {
    if (net > 0) return `${outcomeLabel(kind)}. Lucro de ◆ ${net}.`;
    if (net === 0) return `${outcomeLabel(kind)}. Aposta devolvida.`;
    return `${outcomeLabel(kind)}. Perda de ◆ ${-net}.`;
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
    if (rounds >= BLACKJACK_MAX_ROUNDS || balance < 10) {
      lives--;
      if (!lives) {
        endState = { visible: true, win: false, balance, act };
        return;
      }
      rounds = 0;
      actStart = balance;
      reserveUsed = false;
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
    reserveUsed = false;
    message = 'Novo ato. Escolha sua aposta.';
  }

  function skipShop() {
    shopOpen = false;
    act++;
    rounds = 0;
    actStart = balance;
    reserveUsed = false;
    message = 'Novo ato. Escolha sua aposta.';
  }

  function setBet(value: number) {
    bet = value;
    tone(420);
  }

  function toggleSound() {
    setSound(!soundOn);
    soundOn = !soundOn;
  }
</script>

<main class="game-shell">
  <header class="topbar">
    <div class="brand">
      <a href="#/">← Salão</a>
      <h1>Vinte & Um</h1>
    </div>
    <div class="hud">
      <div class="stat">Ato<strong>{act + 1} / {ACT_COUNT}</strong></div>
      <div class="stat">Fichas<strong>◆ {balance}</strong></div>
      <div class="stat">Mãos<strong>{rounds} / {BLACKJACK_MAX_ROUNDS}</strong></div>
    </div>
    <button class="sound-toggle" onclick={toggleSound} aria-label="Alternar som">{soundOn ? '♪' : '×'}</button>
  </header>

  <div class="layout">
    <aside class="sidebar">
      <RunHud act={act} actCount={ACT_COUNT} profit={profit} target={targets[act]!} lives={lives} livesMax={STARTING_LIVES} />
      <TalismanPanel relics={relics} catalog={BLACKJACK_CATALOG} />
      <History history={history} />
    </aside>

    <section class="stage">
      <div class="table">
        <section class="hand">
          <div class="hand-head">
            <h2>Casa</h2>
            <output class="score">{dealerScore ?? '?'}</output>
          </div>
          <div class="cards" aria-label="Mão da casa">
            {#each dealer as card, i}
              <div class="card" class:card-flip={i === dealer.length - 1} class:red={card.suit === '♥' || card.suit === '♦'} aria-label="Carta da casa">
                {#if hidden && i === 1}
                  <span class="back"></span>
                {:else}
                  <span class="top">{card.rank}{card.suit}</span>
                  <span class="pip">{card.suit}</span>
                  <span class="bot">{card.rank}{card.suit}</span>
                {/if}
              </div>
            {/each}
          </div>
        </section>

        <div>
          <div class="divider"></div>
          <p class="message" role="status" aria-live="polite">{message}</p>
          <Breakdown notes={notes} />
          <div class="bet-bar">
            <span>Aposta</span>
            {#each BLACKJACK_BET_OPTIONS as value}
              <button class:selected={value === bet} onclick={() => setBet(value)} disabled={active}>{value}</button>
            {/each}
          </div>
          <div class="actions">
            <button class="primary" onclick={deal} disabled={active || balance < bet}>Distribuir</button>
            <button onclick={hit} disabled={!active}>Pedir</button>
            <button onclick={stand} disabled={!active}>Parar</button>
          </div>
        </div>

        <section class="hand">
          <div class="hand-head">
            <h2>Sua mão</h2>
            <output class="score">{playerScore}</output>
          </div>
          <div class="cards" aria-label="Sua mão">
            {#each player as card}
              <div class="card card-flip" class:red={card.suit === '♥' || card.suit === '♦'} aria-label="{card.rank} de {card.suit}">
                <span class="top">{card.rank}{card.suit}</span>
                <span class="pip">{card.suit}</span>
                <span class="bot">{card.rank}{card.suit}</span>
              </div>
            {/each}
          </div>
        </section>
      </div>
    </section>
  </div>
</main>

{#if shopOpen}
  <Shop relics={relics} catalog={BLACKJACK_CATALOG} onbuy={buyRelic} onskip={skipShop} canafford={(cost: number) => balance >= cost} />
{/if}

{#if endState.visible}
  <div class="overlay">
    <section class="card">
      <p class="eyebrow">Fim da expedição</p>
      <h2>{endState.win ? 'A Casa se curva' : 'A Casa venceu'}</h2>
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
  .table { display: grid; grid-template-rows: 1fr auto 1fr; min-height: 550px; }
  .hand { display: grid; align-content: center; gap: 9px; min-height: 205px; }
  .hand-head { display: flex; align-items: center; gap: 9px; }
  .hand h2 { margin: 0; color: var(--muted); font: 700 0.68rem system-ui, sans-serif; letter-spacing: 0.15em; text-transform: uppercase; }
  .score { padding: 3px 9px; border: 1px solid var(--line); border-radius: 20px; color: var(--gold); font: 700 0.8rem system-ui, sans-serif; }
  .cards { display: flex; min-height: 148px; padding-left: 13px; }
  .card {
    width: 100px;
    height: 142px;
    flex: 0 0 auto;
    margin-left: -13px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: var(--ink);
    background: var(--cream);
    border: 1px solid #fff;
    border-radius: 7px;
    box-shadow: 0 9px 16px rgb(0 0 0 / 0.28);
    font-weight: 700;
    font-size: 1.25rem;
  }
  .card .top { align-self: flex-start; }
  .card .pip { align-self: center; font-size: 2.3rem; line-height: 1; }
  .card .bot { align-self: flex-end; transform: rotate(180deg); }
  .card.red { color: var(--wine); }
  .card > .back { display: block; width: 100%; height: 100%; border: 5px solid var(--cream); background: repeating-linear-gradient(45deg, #17231f 0 5px, #a97832 5px 7px); border-radius: 4px; }
  .divider { height: 1px; background: linear-gradient(90deg, transparent, var(--line), transparent); margin: 12px 0; }
  .message { min-height: 1.5em; margin: 12px 0; text-align: center; font: 700 clamp(0.95rem, 2.5vw, 1.15rem) system-ui, sans-serif; }
  .bet-bar, .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; }
  .bet-bar button, .actions button { min-height: 44px; border: 1px solid var(--line); border-radius: 4px; padding: 9px 13px; color: var(--cream); background: #153d32; cursor: pointer; transition: transform 0.1s ease, filter 0.1s ease; font: 700 0.8rem system-ui, sans-serif; }
  .bet-bar button:hover:not(:disabled), .actions button:hover:not(:disabled) { filter: brightness(1.14); transform: translateY(-1px); }
  .bet-bar button:active:not(:disabled) { transform: translateY(2px) scale(0.98); }
  .bet-bar button:disabled, .actions button:disabled { opacity: 0.4; cursor: not-allowed; }
  .actions .primary { color: #211b0f; background: var(--gold); border-color: var(--gold); }
  .bet-bar .selected { color: #211b0f; background: var(--gold); border-color: var(--gold); }
  .bet-bar span { align-self: center; color: var(--muted); font: 700 0.65rem system-ui, sans-serif; text-transform: uppercase; }
  .overlay { position: fixed; inset: 0; display: grid; place-items: center; padding: 20px; background: rgb(2 14 11 / 0.86); z-index: 30; }
  .card { width: min(100%, 760px); padding: 24px; border: 1px solid var(--gold); background: #082c24; box-shadow: 0 24px 80px #000; }
  .card h2 { margin: 0; color: var(--gold); letter-spacing: 0.12em; text-transform: uppercase; }
  .eyebrow { margin: 0 0 8px; color: var(--muted); font: 700 0.64rem system-ui, sans-serif; letter-spacing: 0.15em; text-transform: uppercase; }
  .shop-actions { display: flex; justify-content: flex-end; gap: 8px; }
  .shop-actions button { min-height: 44px; border: 1px solid var(--line); border-radius: 4px; padding: 9px 13px; color: var(--cream); background: #123c31; cursor: pointer; }
  .shop-actions .primary { color: #211b0f; background: var(--gold); border-color: var(--gold); }
  @media (max-width: 760px) { .layout { grid-template-columns: 1fr; } .sidebar { grid-template-columns: 1fr 1fr; } .sidebar :global(.panel:last-child) { grid-column: 1 / -1; } }
  @media (max-width: 440px) { .sidebar { grid-template-columns: 1fr; } .sidebar :global(.panel:last-child) { grid-column: auto; } .game-shell { padding: 12px; } .card { width: 80px; height: 114px; font-size: 1rem; } .card .pip { font-size: 1.8rem; } .hud { gap: 8px; } .stat { text-align: left; } }
</style>
