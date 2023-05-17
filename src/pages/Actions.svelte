<script lang="ts">
    import { selectedSafe } from "../stores/singletons/selectedSafe";
    import { push } from "svelte-spa-router";
    import HoGBalance from "./HoGBalance.svelte";
    import {web3} from "../stores/singletons/web3";
</script>

<div class="absolute py-2.5 px-5">
    <img src="/images/dappconf-blue.png" class="w-[60px]" alt="DappConf" />
</div>
<div class="hero min-h-screen bg-black">
    <div />
    <div class="hero-content text-center text-neutral-content">
        <div>
            <h1 class="mb-5 text-5xl font-bold text-primary">
                Hello {$selectedSafe.userName?.trim() === "" ||
                !$selectedSafe.userName
                    ? $selectedSafe.safeAddress
                    : $selectedSafe.userName}!
            </h1>
            <HoGBalance web3={$web3} circlesSafe={$selectedSafe} />
            <p class="mb-5 text-primary">
                You can do the following things with your Circles Safe:
            </p>
            <button
                    class="btn btn-primary mb-5 text-primary bg-black"
                    on:click={() => push("/mint-hog")}>Mint HoG</button
            ><br />
            <button
                    class="btn btn-primary mb-5 text-primary bg-black"
                    on:click={() => push("/connect-circles-safe")}>Select different safe</button
            ><br />
            <button
                    class="btn btn-primary mb-5 text-primary bg-black"
                    on:click={() => push("/connect-wallet")}>Connect different wallet</button
            ><br />
            <!--
            <button
                class="btn btn-primary mb-5 text-primary bg-black"
                on:click={() => push("/transfer-hog")}>Transfer HoG</button
            ><br />
            -->
        </div>
    </div>
</div>
