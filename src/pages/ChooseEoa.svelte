<script lang="ts">
    import Onboard from "@web3-onboard/core";
    import injectedModule from "@web3-onboard/injected-wallets";
    import walletConnectModule from "@web3-onboard/walletconnect";
    import {AppMetadata, Chains} from "../consts";
    import { createEventDispatcher } from "svelte";

    const injected = injectedModule();
    const walletConnect = walletConnectModule();

    const wallets = [injected, walletConnect];

    const onboard = Onboard({
      wallets: wallets,
      chains: Chains,
      appMetadata: AppMetadata,
    });

    // Subscribe to wallet updates
    const wallets$ = onboard.state.select("wallets");

    // The first wallet in the array of connected wallets
    $: connectedAccount = $wallets$?.[0]?.accounts?.[0];

    $: account = connectedAccount?.ens?.name
        ? {
              ens: connectedAccount?.ens,
              address: connectedAccount?.address,
          }
        : { address: connectedAccount?.address };

    const dispatch = createEventDispatcher();

    const connect = async () => {
        await onboard.connectWallet();
        const wallet = $wallets$?.[0];
        dispatch("connected", wallet);
    };

    const disconnect = ({ label }) => {
        onboard.disconnectWallet({ label });
        dispatch("disconnected", label);
    };
</script>

<div class="hero min-h-screen bg-black">
    <div class="hero-content">
        <div>
            <div class="text-center text-neutral-content">
                <h1 class="mb-2 text-5xl font-bold text-primary">
                    Connect your wallet
                </h1>
                <p class="mb-5 text-primary">
                    We will add the address of this wallet as additional owner
                    to your safe.
                </p>
            </div>
            <div class="text-center text-neutral-content">
                {#if $wallets$?.[0]?.provider}
                    <div>
                        <div class="mb-5 text-xl font-bold text-primary">
                            {connectedAccount.address}
                        </div>
                        <div class="mb-5 text font-bold text-primary">
                            Connected to {$wallets$?.[0]?.label}
                        </div>
                        <button
                            class="btn btn-secondary text-primary rounded-full w-80"
                            on:click={() => {
                                disconnect($wallets$?.[0]);
                            }}>Disconnect</button
                        >
                    </div>
                {:else}
                    <div>
                        <button
                            on:click={connect}
                            class="btn btn-primary text-primary rounded-full w-80"
                            >Connect</button
                        >
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
