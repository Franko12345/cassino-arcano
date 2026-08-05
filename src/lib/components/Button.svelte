<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props {
    class?: string;
    onclick?: () => void;
    disabled?: boolean;
    primary?: boolean;
    danger?: boolean;
    type?: 'button' | 'reset';
    children?: Snippet;
  }
  let { class: className = '', onclick, disabled = false, primary = false, danger = false, type = 'button', children }: Props = $props();
</script>

<button
  {type}
  class="btn {primary ? 'primary' : ''} {danger ? 'danger' : ''} {className}"
  {disabled}
  {onclick}
>
  {#if children}{@render children()}{/if}
</button>

<style>
  .btn {
    min-height: 44px;
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 9px 13px;
    color: var(--cream);
    background: #123c31;
    font: 700 0.75rem/1 system-ui, sans-serif;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform 0.1s ease, filter 0.1s ease;
  }
  .btn:hover:not(:disabled) { filter: brightness(1.14); transform: translateY(-1px); }
  .btn:active:not(:disabled) { transform: translateY(2px) scale(0.98); }
  .btn:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
  .btn:disabled { opacity: 0.38; cursor: not-allowed; }
  .btn.primary { color: #241d0e; background: var(--gold); border-color: var(--gold); }
  .btn.danger { background: var(--wine); }
</style>
