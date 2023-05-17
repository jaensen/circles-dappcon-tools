<script lang="ts">
  import Safe from "@safe-global/protocol-kit";
  import { createEventDispatcher } from "svelte";
  import { HUB_ABI } from "../abis/hub";
  import { HubAddress } from "../consts";
  import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
  import { web3 } from "../stores/singletons/web3";
  import { push } from "svelte-spa-router";
  import Frame from "../components/Frame.svelte";
  export let safe: Safe;

  let working = false;
  let error = false;
  let status: string;
  let done = false;

  const dispatch = createEventDispatcher();

  async function deploySafe() {
    try {
      working = true;
      error = false;
      status = `Generating 'Signup' call data ...`;
      const signupCallData = new $web3.eth.Contract(HUB_ABI, HubAddress).methods
        .signup()
        .encodeABI();
      const safeTransactionData: SafeTransactionDataPartial = {
        data: signupCallData,
        to: HubAddress,
        value: "0",
      };

      status = `Creating safe transaction ...`;
      const safeTransaction = await safe.createTransaction({
        safeTransactionData: safeTransactionData,
      });

      status = `Signing safe transaction ...`;
      const signedTx = await safe.signTransaction(safeTransaction);

      status = `Executing safe transaction ...`;
      const transactionResult = await safe.executeTransaction(signedTx);

      status = `Signed up!`;
      dispatch("signupCompleted", transactionResult);
      push("/");
      done = true;
    } catch (e) {
      status = `Error: ${e.message}`;
      error = true;
    } finally {
      working = false;
    }
  }
</script>

<Frame>
  <h1 class="mb-5 text-5xl font-bold">Circles registration</h1>
  <p class="mb-5">Click the button below to sign up at the Circles Hub.</p>
  {#if !working && !error && !done}
    <button on:click={deploySafe} class="mb-5 btn btn-outline">Signup</button>
  {:else if error}
    <button on:click={deploySafe} class="mb-5 btn btn-active btn-outline"
      >Retry: Signup</button
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
