<script lang="ts">
  interface Props {
    relics: readonly string[];
    catalog: readonly { id: string; name: string; text: string; cost: number }[];
  }
  let { relics, catalog }: Props = $props();
</script>

<section class="panel">
  <p class="eyebrow">Talismãs · 3 máx.</p>
  <div class="talismans">
    {#if relics.length === 0}
      <span class="empty">Nenhum Talismã.</span>
    {:else}
      {#each catalog.filter((r) => relics.includes(r.id)) as relic}
        <div class="talisman">
          <strong>{relic.name}</strong>
          <small>{relic.text}</small>
        </div>
      {/each}
    {/if}
  </div>
</section>

<style>
  .panel { padding: 14px; border: 1px solid var(--line); background: rgb(4 37 29 / 0.72); box-shadow: 0 8px 20px rgb(0 0 0 / 0.16); }
  .eyebrow { margin: 0 0 8px; color: var(--muted); font: 700 0.64rem system-ui, sans-serif; letter-spacing: 0.15em; text-transform: uppercase; }
  .talismans { display: grid; gap: 8px; }
  .talisman { padding: 9px; border: 1px solid var(--line); background: #102f29; }
  .talisman strong { display: block; color: var(--gold); font-size: 0.82rem; }
  .talisman small { display: block; margin-top: 3px; color: var(--muted); font: 400 0.7rem/1.3 system-ui, sans-serif; }
  .empty { color: var(--muted); font: italic 0.78rem Georgia, serif; }
</style>
