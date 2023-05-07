<script lang="ts">
import Home from "../pages/Home.svelte";
import Actions from "../pages/Actions.svelte";
import {selectedSafe} from "../stores/singletons/selectedSafe";
import {push} from "svelte-spa-router";

function onConnectWallet(event) {
    push("/connect");
}

</script>
{#if !$selectedSafe}
    <Home on:click={onConnectWallet} />
{:else}
    <Actions selectedSafe={$selectedSafe} />
{/if}
