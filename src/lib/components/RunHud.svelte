<script lang="ts">
  interface Props {
    act: number;
    actCount: number;
    profit: number;
    target: number;
    lives: number;
    livesMax: number;
  }
  let { act, actCount, profit, target, lives, livesMax }: Props = $props();
  let pct = $derived(Math.max(0, Math.min(100, (profit / target) * 100)));
  let lifeSymbols = $derived(
    '♥ '.repeat(lives) + '♡ '.repeat(Math.max(0, livesMax - lives))
  );
</script>

<section class="panel">
  <p class="eyebrow">Contrato</p>
  <div class="run-numbers">
    <span>Lucro <b>{profit}</b></span>
    <span>Meta <b>{target}</b></span>
  </div>
  <div class="progress">
    <span style="width:{pct}%"></span>
  </div>
  <p class="eyebrow" style="margin-top:12px">Vidas</p>
  <div class="lives" aria-label="Vidas: {lives} de {livesMax}">{lifeSymbols}</div>
  <p class="eyebrow" style="margin-top:12px">Ato</p>
  <div class="run-numbers"><b>{act + 1} / {actCount}</b></div>
</section>

<style>
  .panel { padding: 14px; border: 1px solid var(--line); background: rgb(4 37 29 / 0.72); box-shadow: 0 8px 20px rgb(0 0 0 / 0.16); }
  .eyebrow { margin: 0 0 8px; color: var(--muted); font: 700 0.64rem system-ui, sans-serif; letter-spacing: 0.15em; text-transform: uppercase; }
  .run-numbers { display: flex; justify-content: space-between; font: 700 0.72rem system-ui, sans-serif; }
  .progress { height: 9px; overflow: hidden; border-radius: 9px; background: #061e18; }
  .progress > span { display: block; height: 100%; background: var(--gold); transition: width 0.3s ease; }
  .lives { color: var(--wine); font-size: 1.2rem; letter-spacing: 0.12em; }
</style>
