<script lang="ts">
    export let onContinue: () => void;
</script>

<h1 class="mb-5 text-5xl font-bold text-primary">Import Circles Safe</h1>
<p class="mb-5">
    In the next steps you will be able to import your existing Circles safe.
</p>
<button
    class="btn btn-outline text-primary rounded-full w-80"
    on:click={() => onContinue?.()}
>
    Start import
</button>
