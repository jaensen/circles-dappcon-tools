<script lang="ts">
  export let onContinue: () => void;
</script>

<h1 class="mb-5 text-5xl font-bold text-primary">Create Circles Safe</h1>
<p class="mb-5">
  In the next steps you will be able to create a new Safe and register it for user with Circles.
</p>
<button class="btn btn-outline text-primary" on:click={() => onContinue?.()}>
  Start procedure
</button>
