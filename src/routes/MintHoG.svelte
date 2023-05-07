<script lang="ts">
    import BalanceAndMaxMintAmount from "../pages/BalanceAndMaxMintAmount.svelte";
    import {HoGTokenAddress} from "../consts";
    import MintHoG from "../pages/MintHoG.svelte";
    import {web3} from "../stores/singletons/web3";
    import {selectedSafe} from "../stores/singletons/selectedSafe";

    let mintAmount = 0;

    function onMintHoG(amount: number) {
        mintAmount = amount;
    }
</script>

<BalanceAndMaxMintAmount on:mint={e => onMintHoG(e.detail)}
                   web3={$web3}
                   circlesSafe={$selectedSafe}
                   toAddress={HoGTokenAddress} />
{#if mintAmount > 0}
    <MintHoG web3={$web3}
             circlesSafe={$selectedSafe}
             mintAmount={mintAmount} />
{/if}
