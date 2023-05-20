<script lang="ts">
    import {mnemonicToEntropy} from "bip39";
    import {CirclesSafe} from "../models/circlesSafe";
    import {web3} from "../stores/singletons/web3";
    import {createAddOwnerStore} from "../stores/factories/tx/createAddOwnerStore";
    import ActionButton from "../components/ActionButton.svelte";
    import {connectedWalletAddress} from "../stores/singletons/connectedWalletAddress";

    export let mnemonicPhrase: string;
    export let newOwnerAddress: string;
    export let selectedSafe: CirclesSafe;
</script>
<ActionButton title={`Add new owner`}
              description={`You're about to add ${newOwnerAddress} as an owner to the safe ${selectedSafe.safeAddress}.`}
              actionButtonText="Add owner"
              allowRetry={true}
              actionFactory={() => createAddOwnerStore(
                  $web3,
                  $connectedWalletAddress,
                  mnemonicToEntropy(mnemonicPhrase),
                  selectedSafe.safeAddress)} />
