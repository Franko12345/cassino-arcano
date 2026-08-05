<script lang="ts">
  interface Props {
    notes: readonly string[];
  }
  let { notes }: Props = $props();
</script>

<div class="breakdown">
  {#each notes as note}
    <span class="beat">{note}</span>
  {/each}
</div>

<style>
  .breakdown { display: flex; min-height: 32px; flex-wrap: wrap; justify-content: center; gap: 6px; }
  .beat { padding: 5px 8px; border: 1px solid var(--line); color: var(--gold); background: #0d3028; font: 700 0.72rem system-ui, sans-serif; animation: pop 0.2s ease-out both; }
  @keyframes pop {
    0% { opacity: 0; transform: scale(0.72); }
    70% { transform: scale(1.08); }
  }
  @media (prefers-reduced-motion: reduce) {
    .beat { animation: none; }
  }
</style>
