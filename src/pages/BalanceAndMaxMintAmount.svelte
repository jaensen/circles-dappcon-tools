<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { CirclesSafe } from "../models/circlesSafe";
    import { crcToTc } from "@circles/timecircles";
    import Web3 from "web3";
    import { createFindPaymentPath } from "../stores/factories/queries/createFindPaymentPath";
    import { createFindCrcBalance } from "../stores/factories/queries/createFindCrcBalance";
    import { createFindHoGBalance } from "../stores/factories/queries/createFindHoGBalance";
    import { connectedWalletAddress } from "../stores/singletons/connectedWalletAddress";

    export let circlesSafe: () => CirclesSafe;
    export let toAddress: () => string;
    export let onMint: (amount: number) => void;
    export let web3: () => Web3;

    let mintAmount: number;

    const paymentPathStore = createFindPaymentPath();
    const crcBalanceStore = createFindCrcBalance();
    const hogSafeBalanceStore = createFindHoGBalance();
    const hogWalletBalanceStore = createFindHoGBalance();

    $: maxMintAmount = $paymentPathStore.result
        ? Math.floor(
              Number.parseFloat(
                  Web3.utils.fromWei(
                      $paymentPathStore.result.maxFlow,
                      "ether"
                  ) ?? "0"
              )
          )
        : 0;

    onMount(async () => {
        let safe = circlesSafe?.();
        let to = toAddress?.();
        let w3 = web3?.();

        if (safe?.safeAddress && to && w3) {
            paymentPathStore.search({
                from: safe.safeAddress,
                to: to,
                amount: "99999999999999999000000000000000000",
                web3: w3,
            });
        }
        if (safe?.safeAddress && w3) {
            console.log("searching crc balance");
            crcBalanceStore.search({ address: safe.safeAddress });
            hogSafeBalanceStore.search({
                address: safe.safeAddress,
                web3: w3,
            });
            hogWalletBalanceStore.search({
                address: $connectedWalletAddress,
                web3: w3,
            });
        }
    });
    const dispatch = createEventDispatcher();
</script>

<div>
    {#if !$crcBalanceStore.result}
        <div class="loader">
            <div class="loaderBar" />
        </div>

        <p class="text-info text-primary">Loading your Circles balance ...</p>
    {:else if $crcBalanceStore.result}
        <p class="text-primary">Your Circles balance:</p>
        <h1 class="mb-5 text-5xl font-bold text-primary">
            {Math.floor(
                crcToTc(
                    Date.now(),
                    Number.parseFloat(
                        Web3.utils.fromWei($crcBalanceStore.result, "ether")
                    )
                )
            )} Circles
        </h1>
    {:else if $crcBalanceStore.error}
        <p class="text-error text-primary">
            An error occurred while loading your Circles balance:<br />
            {$crcBalanceStore.error.message}
        </p>
    {/if}
    {#if !$hogSafeBalanceStore.result || !$hogWalletBalanceStore.result}
        <div class="loader">
            <div class="loaderBar" />
        </div>
        <p class="text-info text-primary">Loading your HoG balances ...</p>
    {:else if $hogSafeBalanceStore.result && $hogWalletBalanceStore.result}
        {#if $hogSafeBalanceStore.result !== "0.00"}
            <p class="text-primary">Your HoG balance (Safe):</p>
            <h1 class="mb-5 text-5xl font-bold text-primary">
                {$hogSafeBalanceStore.result} HoG
            </h1>
        {/if}
        {#if $hogWalletBalanceStore.result !== "0.00"}
            <p class="text-primary">Your HoG balance (Wallet):</p>
            <h1 class="mb-5 text-5xl font-bold text-primary">
                {$hogWalletBalanceStore.result} HoG
            </h1>
        {/if}
    {:else if $hogSafeBalanceStore.error || $hogWalletBalanceStore.error}
        <p class="text-error text-primary">
            An error occurred while loading your HoG balance:<br />
            {$hogSafeBalanceStore.error?.message ?? ""}
            {$hogWalletBalanceStore.error?.message ?? ""}
        </p>
    {/if}
    {#if !$paymentPathStore.result}
        <div class="loader">
            <div class="loaderBar" />
        </div>
        <p class="text-info text-primary">
            Calculating your token minting limit ...
        </p>
    {:else if $paymentPathStore.error}
        <p class="text-error text-primary">
            An error occurred while calculating your token minting limit:<br />
            {$paymentPathStore.error.message}
        </p>
    {:else if $paymentPathStore.result?.maxFlow}
        <p class="text-primary">You can mint:</p>
        <h2 class="mb-5 text-3xl font-bold text-primary">
            {Math.floor(
                Number.parseFloat(
                    Web3.utils.fromWei(
                        $paymentPathStore.result.maxFlow,
                        "ether"
                    )
                )
            )} HoG
        </h2>
    {/if}
    {#if $paymentPathStore.result && $paymentPathStore?.result?.maxFlow}
        <div class="items-center form-control">
            <input
                type="number"
                class="w-full max-w-xs mb-5 text-center bg-white input input-bordered text-input text-blue"
                placeholder="Amount"
                min="0"
                max={maxMintAmount}
                bind:value={mintAmount}
            />
            <button
                disabled={!mintAmount ||
                    mintAmount <= 0 ||
                    maxMintAmount == 0 ||
                    mintAmount > maxMintAmount}
                on:click={() => onMint(mintAmount)}
                class="btn btn-primary text-primary bg-blue rounded-full w-80 normal-case"
                >MINT HoG
            </button>
        </div>
    {/if}
</div>
