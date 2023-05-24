<script lang="ts">
  import Activity from "../components/Activity.svelte";
  import {web3} from "../stores/singletons/web3";
  import {connectedWalletAddress} from "../stores/singletons/connectedWalletAddress";
  import {createDeploySafeStore} from "../stores/factories/tx/createDeploySafeStore";
  import type {ActionStatus} from "../models/executionState";
  export let onDone: (actionStatus:ActionStatus) => void;
</script>
<Activity title={`Deploy a new Safe`}
          description={`Click the button below to deploy a new Circles Safe on the Gnosis Chain.`}
          actionButtonText="Deploy"
          allowRetry={true}
          onDone={onDone}
          actionFactory={() => createDeploySafeStore($web3, $connectedWalletAddress)} />
