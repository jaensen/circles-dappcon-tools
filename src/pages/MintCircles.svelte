<script lang="ts">
    import type {CirclesSafe} from "../models/circlesSafe";
    import {createMintUbiStore} from "../stores/factories/tx/createMintUbiStore";
    import Activity from "../components/Activity.svelte";
    import type {ActionStatus} from "../models/executionState";
    import {web3} from "../stores/singletons/web3";

    export let circlesSafe: () => CirclesSafe;
    export let onDone: (actionStatus:ActionStatus) => void;
</script>

<Activity title="Mint UBI"
          description="You're about to mint UBI."
          actionButtonText="Mint"
          allowRetry={true}
          onDone={onDone}
          actionFactory={() => createMintUbiStore($web3, circlesSafe())} />
