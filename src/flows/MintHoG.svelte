<script lang="ts">
    import Web3 from "web3";
    import Safe from "@safe-global/protocol-kit";
    import {createEventDispatcher} from "svelte";
    import Balance from "../pages/Balance.svelte";

    export let web3: Web3;
    export let circlesSafe: Safe;

    const dispatch = createEventDispatcher();
</script>

{#if !web3}
    <p>'web3' not set</p>
{:else}
    <Balance web3={web3} />
{/if}
