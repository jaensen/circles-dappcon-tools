<script lang="ts">
    import ChooseSafe from "../pages/ChooseSafe.svelte";
    import {selectedSafe} from "../stores/singletons/selectedSafe";
    import {connectedWalletAddress} from "../stores/singletons/connectedWalletAddress";
    import {push} from "svelte-spa-router";
</script>

<ChooseSafe on:safeSelected={e => {
                selectedSafe.set(e.detail);
                console.log("safe selected", e.detail);
                push('/')
            }}
            on:import={() => push("/import-circles-safe")}
            on:signup={() => push("/create-circles-safe")}
            ownerAddress={$connectedWalletAddress} />
