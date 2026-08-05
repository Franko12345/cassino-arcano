<script lang="ts">
  interface Props {
    relics: readonly string[];
    catalog: readonly { id: string; name: string; text: string; cost: number }[];
    consumable?: { id: string; name: string; text: string; cost: number } | null;
    onbuy?: (relic: { id: string; name: string; text: string; cost: number }) => void;
    onbuyConsumable?: () => void;
    onskip?: () => void;
    canafford?: (cost: number) => boolean;
  }
  let { relics, catalog, consumable = null, onbuy, onbuyConsumable, onskip, canafford = () => true }: Props = $props();

  const OPTIONS = 3;
  let choices = $state<{ id: string; name: string; text: string; cost: number }[]>([]);

  $effect(() => {
    if (choices.length === 0) pick();
  });

  function pick() {
    const available = catalog.filter((r) => !relics.includes(r.id));
    const shuffled = [...available].sort(() => crypto.getRandomValues(new Uint32Array(1))[0]! / 2 ** 32 - 0.5);
    choices = shuffled.slice(0, OPTIONS);
  }

  function reroll() {
    pick();
  }
</script>

<div class="overlay">
  <section class="card">
    <p class="eyebrow">Contrato concluído</p>
    <h2>Escolha um Talismã</h2>
    <p>Compre poder ou preserve suas fichas para o próximo ato.</p>
    <div class="choices">
      {#if consumable}
        <button
          class="relic-choice consumable-slot"
          disabled={!canafford(consumable.cost)}
          onclick={() => onbuyConsumable?.()}
        >
          <strong>{consumable.name}</strong>
          <span>{consumable.text}</span>
          <em>◆ {consumable.cost}</em>
        </button>
      {/if}
      {#each choices as relic}
        <button
          class="relic-choice"
          disabled={!canafford(relic.cost) || relics.length >= 3}
          onclick={() => onbuy?.(relic)}
        >
          <strong>{relic.name}</strong>
          <span>{relic.text}</span>
          <em>◆ {relic.cost}</em>
        </button>
      {/each}
    </div>
    <div class="actions">
      <button class="primary" onclick={reroll}>Reembaralhar</button>
      <button onclick={() => onskip?.()}>Pular loja</button>
    </div>
  </section>
</div>

<style>
  .overlay { position: fixed; inset: 0; display: grid; place-items: center; padding: 20px; background: rgb(2 14 11 / 0.86); z-index: 30; }
  .card { width: min(100%, 760px); padding: 24px; border: 1px solid var(--gold); background: #082c24; box-shadow: 0 24px 80px #000; }
  .card h2 { margin: 0; color: var(--gold); letter-spacing: 0.12em; text-transform: uppercase; }
  .eyebrow { margin: 0 0 8px; color: var(--muted); font: 700 0.64rem system-ui, sans-serif; letter-spacing: 0.15em; text-transform: uppercase; }
  .choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 18px 0; }
  .choices:has(.consumable-slot) { grid-template-columns: repeat(4, 1fr); }
  .relic-choice { min-height: 150px; padding: 16px; text-align: left; background: #12382f; border: 1px solid var(--line); border-radius: 4px; color: var(--cream); font: 700 0.75rem system-ui, sans-serif; cursor: pointer; }
  .relic-choice:disabled { opacity: 0.4; cursor: not-allowed; }
  .relic-choice strong { display: block; color: var(--gold); font: 700 1rem Georgia, serif; }
  .relic-choice span { display: block; margin-top: 8px; color: var(--muted); font: 400 0.75rem/1.4 system-ui, sans-serif; }
  .relic-choice em { display: block; margin-top: 12px; color: var(--cream); font-style: normal; }
  .consumable-slot { border-color: var(--cyan); }
  .actions { display: flex; justify-content: flex-end; gap: 8px; }
  .actions .primary { color: #241d0e; background: var(--gold); border-color: var(--gold); }
  @media (max-width: 760px) { .choices { grid-template-columns: 1fr; } .choices:has(.consumable-slot) { grid-template-columns: 1fr; } .relic-choice { min-height: 100px; } }
</style>
