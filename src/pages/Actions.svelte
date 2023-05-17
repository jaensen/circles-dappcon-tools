<script lang="ts">
  import { selectedSafe } from "../stores/singletons/selectedSafe";
  import { push } from "svelte-spa-router";
  import HoGBalance from "./HoGBalance.svelte";
  import { web3 } from "../stores/singletons/web3";
  import Frame from "../components/Frame.svelte";
</script>

<Frame backgroundColor="bg-black">
  <div class="text-center">
    <h1 class="mb-5 text-5xl font-bold text-primary">
      Hello {$selectedSafe.userName?.trim() === "" || !$selectedSafe.userName
        ? $selectedSafe.safeAddress
        : $selectedSafe.userName}!
    </h1>
    <HoGBalance web3={$web3} circlesSafe={$selectedSafe} />
    <p class="mb-5 text-primary">
      You can do the following things with your Circles Safe:
    </p>
    <button
      class="mb-5 btn btn-outline text-primary"
      on:click={() => push("/mint-hog")}>Mint HoG</button
    ><br />
    <button
      class="mb-5 btn btn-outline text-primary btn-sm"
      on:click={() => push("/connect-circles-safe")}
      >Select different safe</button
    ><br />
    <button
      class="mb-5 btn btn-outline text-primary btn-sm"
      on:click={() => push("/connect-wallet")}>Connect different wallet</button
    ><br />
    <!--
            <button
                class="mb-5 bg-black btn btn-primary text-primary"
                on:click={() => push("/transfer-hog")}>Transfer HoG</button
            ><br />
            -->
  </div>
</Frame>
