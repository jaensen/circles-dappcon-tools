<script lang="ts">
  export let onContinue: () => void;
</script>

<h1 class="mb-5 text-5xl font-bold text-primary">Hello there</h1>
<p class="mb-5">
  This tool connects your familiar Wallet to your Circles Safe.
</p>
<button class="btn btn-outline text-primary" on:click={() => onContinue?.()}
  >Get started</button
>
