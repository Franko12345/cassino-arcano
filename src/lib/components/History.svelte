<script lang="ts">
  interface Entry {
    label: string;
    value: string;
  }
  interface Props {
    history: readonly Entry[];
  }
  let { history }: Props = $props();
</script>

<section class="panel">
  <p class="eyebrow">Últimas mãos</p>
  <div class="history">
    {#each history as entry}
      <div>
        <span>{entry.label}</span>
        <b>{entry.value}</b>
      </div>
    {/each}
  </div>
</section>

<style>
  .panel { padding: 14px; border: 1px solid var(--line); background: rgb(4 37 29 / 0.72); box-shadow: 0 8px 20px rgb(0 0 0 / 0.16); }
  .eyebrow { margin: 0 0 8px; color: var(--muted); font: 700 0.64rem system-ui, sans-serif; letter-spacing: 0.15em; text-transform: uppercase; }
  .history { display: grid; gap: 4px; max-height: 120px; overflow: auto; }
  .history > div { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid rgb(255 255 255 / 0.08); color: var(--muted); font: 0.68rem system-ui, sans-serif; }
  .history b { color: var(--cream); font-weight: 700; }
</style>
