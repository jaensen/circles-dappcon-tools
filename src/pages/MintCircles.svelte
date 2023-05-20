<script lang="ts">
    import type Web3 from "web3";
    import type {CirclesSafe} from "../models/circlesSafe";
    import {createMintUbiStore} from "../stores/factories/tx/createMintUbiStore";
    import ActionButton from "../components/ActionButton.svelte";

    export let web3: Web3;
    export let circlesSafe: CirclesSafe;
</script>

<ActionButton title="Mint UBI"
              description="You're about to mint UBI."
              actionButtonText="Mint"
              allowRetry={true}
              actionFactory={() => createMintUbiStore(web3, circlesSafe)} />
