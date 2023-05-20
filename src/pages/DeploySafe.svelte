<script lang="ts">
  import ActionButton from "../components/ActionButton.svelte";
  import {web3} from "../stores/singletons/web3";
  import {connectedWalletAddress} from "../stores/singletons/connectedWalletAddress";
  import {createDeploySafeStore} from "../stores/factories/tx/createDeploySafeStore";
</script>
<ActionButton title={`Deploy a new Safe`}
              description={`Click the button below to deploy a new Circles Safe on the Gnosis Chain.`}
              actionButtonText="Deploy"
              allowRetry={true}
              actionFactory={() => createDeploySafeStore($web3, $connectedWalletAddress)} />
