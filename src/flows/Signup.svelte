<script lang="ts">
    import DeploySafe from "../pages/DeploySafe.svelte";
    import Web3 from "web3";
    import Safe from "@safe-global/protocol-kit";
    import HubSignup from "../pages/HubSignup.svelte";
    import {TransactionResult} from "@safe-global/safe-core-sdk-types";
    import {createEventDispatcher} from "svelte";

    export let web3: Web3;
    export let owner: string;
    export let threshold: number = 1;

    const dispatch = createEventDispatcher();

    let deployedSafe: Safe;
    let signupTransactionResult: TransactionResult;

    function onSafeDeployed(event: CustomEvent) {
        deployedSafe = event.detail;
    }

    function onSignupCompleted(event: TransactionResult) {
        signupTransactionResult = event;
        dispatch("signupCompleted", deployedSafe);
    }
</script>

{#if !web3}
    <p>'web3' not set</p>
{:else if !deployedSafe}
    <DeploySafe owner={owner}
                web3={web3}
                threshold={threshold}
                on:safeDeployed={onSafeDeployed} />
{:else if deployedSafe}
    <HubSignup web3={web3}
               safe={deployedSafe}
               on:signupCompleted={onSignupCompleted} />
{/if}
