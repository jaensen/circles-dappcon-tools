<script lang="ts">
  import {
    SafeAccountConfig,
    SafeFactory,
    Web3Adapter,
  } from "@safe-global/protocol-kit";
  import { createEventDispatcher } from "svelte";
  import { web3 } from "../stores/singletons/web3";
  import { connectedWalletAddress } from "../stores/singletons/connectedWalletAddress";
  import Frame from "../components/Frame.svelte";

  export let threshold: number = 1;

  let working = false;
  let error = false;
  let status: string;
  let done = false;

  const dispatch = createEventDispatcher();

  async function deploySafe() {
    if (!$connectedWalletAddress || $connectedWalletAddress === "") {
      status = `No owner provided`;
      error = true;
      return;
    }

    try {
      error = false;
      working = true;
      status = `Initializing safe sdk ...`;
      const ethAdapter = new Web3Adapter({
        web3: $web3,
        signerAddress: $connectedWalletAddress,
      });

      status = `Creating safe factory ...`;
      const safeFactory = await SafeFactory.create({
        ethAdapter,
        isL1SafeMasterCopy: false,
      });
      const safeAccountConfig: SafeAccountConfig = {
        owners: [$connectedWalletAddress],
        threshold: threshold,
      };

      status = `Deploying safe ...`;
      const safe = await safeFactory.deploySafe({ safeAccountConfig });
      status = `Address: ${safe.getAddress()}`;

      dispatch("safeDeployed", safe);
      done = true;
    } catch (e) {
      status = `Error: ${e.message}`;
      error = true;
    } finally {
      working = false;
    }
  }
</script>

<Frame backgroundColor="bg-black">
  <h1 class="mb-5 text-5xl font-bold text-primary">Deploy a new Safe</h1>
  <p class="mb-5 text-primary">
    Click the button below to deploy a new Circles Safe on the Gnosis Chain
  </p>
  {#if !working && !error && !done}
    <button on:click={deploySafe} class="mb-5 btn btn-outline">Deploy</button>
  {:else if error}
    <button on:click={deploySafe} class="mb-5 btn btn-outline"
      >Retry: Deploy</button
    >
    <p class="text-error">{status}</p>
  {:else if done}
    <p class="text-success">{status}</p>
  {:else}
    <div class="loader">
      <div class="loaderBar" />
    </div>
    <p class="text-info">{status}</p>
  {/if}
</Frame>
