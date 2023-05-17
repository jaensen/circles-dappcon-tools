<script lang="ts">
  import DeploySafe from "../pages/DeploySafe.svelte";
  import Web3 from "web3";
  import Safe from "@safe-global/protocol-kit";
  import HubSignup from "../pages/HubSignup.svelte";
  import { type TransactionResult } from "@safe-global/safe-core-sdk-types";
  import { createEventDispatcher } from "svelte";
  import { selectedSafe } from "../stores/singletons/selectedSafe";
  import { connectedWalletAddress } from "../stores/singletons/connectedWalletAddress";

  export let threshold: number = 1;

  const dispatch = createEventDispatcher();

  let deployedSafe: Safe;
  let signupTransactionResult: TransactionResult;

  function onSafeDeployed(event: CustomEvent) {
    deployedSafe = event.detail;
    selectedSafe.set({
      safeAddress: deployedSafe.getAddress(),
      ownerAddress: $connectedWalletAddress,
      userName: deployedSafe.getAddress(),
      type: "Person",
      userAvatar:
        "https://avatars.dicebear.com/api/avataaars/0x" +
        deployedSafe.getAddress() +
        ".svg",
    });
  }

  function onSignupCompleted(event: TransactionResult) {
    signupTransactionResult = event;
    dispatch("signupCompleted", deployedSafe);
  }
</script>

{#if !deployedSafe}
  <DeploySafe {threshold} on:safeDeployed={onSafeDeployed} />
{:else}
  <HubSignup safe={deployedSafe} on:signupCompleted={onSignupCompleted} />
{/if}
