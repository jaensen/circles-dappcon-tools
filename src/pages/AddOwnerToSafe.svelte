<script lang="ts">
    import {CirclesSafe} from "../models/circlesSafe";
    import {web3} from "../stores/singletons/web3";
    import {createAddOwnerStore} from "../stores/factories/tx/createAddOwnerStore";
    import Activity from "../components/Activity.svelte";
    import {connectedWalletAddress} from "../stores/singletons/connectedWalletAddress";
    import type {ActionStatus} from "../models/executionState";

    export let privateKey: () => string;
    export let newOwnerAddress: () => string;
    export let selectedSafe: () => CirclesSafe;
    export let onDone: (actionStatus:ActionStatus) => void;
</script>
<Activity title={`Add new owner`}
              description={`You're about to add ${newOwnerAddress()} as an owner to the safe ${selectedSafe().safeAddress}.`}
              actionButtonText="Add owner"
              allowRetry={true}
              onDone={onDone}
              actionFactory={() => createAddOwnerStore(
                  $web3,
                  $connectedWalletAddress,
                  privateKey(),
                  selectedSafe().safeAddress)} />
