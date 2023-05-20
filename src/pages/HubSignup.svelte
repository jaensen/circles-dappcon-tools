<script lang="ts">
    import {web3} from "../stores/singletons/web3";
    import Activity from "../components/Activity.svelte";
    import type {ActionStatus} from "../models/executionState";
    import {createSignupStore} from "../stores/factories/tx/createSignupStore";
    import type {CirclesSafe} from "../models/circlesSafe";

    export let onDone: (actionStatus:ActionStatus) => void;
    export let safe: () => CirclesSafe;
</script>
<Activity title={`Sign up for Circles`}
          description={`Click the button below to sign you Safe up for Circles.`}
          actionButtonText="Sign up"
          allowRetry={true}
          onDone={onDone}
          actionFactory={() => createSignupStore($web3, safe())} />
