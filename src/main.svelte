<script lang="ts">
  import { route, navigate } from '$lib/router';
  import HomePage from '$pages/HomePage.svelte';
  import BlackjackPage from '$pages/BlackjackPage.svelte';
  import RoulettePage from '$pages/RoulettePage.svelte';
</script>

{#if $route === 'home'}
  <HomePage />
{:else if $route === 'blackjack'}
  <BlackjackPage />
{:else if $route === 'roulette'}
  <RoulettePage />
{:else}
  <main class="salon">
    <header><h1>404</h1></header>
    <p>Jogo não encontrado.</p>
    <button class="primary" onclick={() => navigate('/')}>Voltar</button>
  </main>
{/if}
