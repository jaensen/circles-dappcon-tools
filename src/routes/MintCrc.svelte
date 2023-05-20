<script lang="ts">
    import {web3} from "../stores/singletons/web3";
    import {selectedSafe} from "../stores/singletons/selectedSafe";
    import MintCircles from "../pages/MintCircles.svelte";
</script>

<MintCircles web3={$web3}
         circlesSafe={$selectedSafe} />
