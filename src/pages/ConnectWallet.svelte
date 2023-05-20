<script lang="ts">
  import Onboard from "@web3-onboard/core";
  import injectedModule from "@web3-onboard/injected-wallets";
  import walletConnectModule from "@web3-onboard/walletconnect";
  import { AppDescription, AppIcon, AppName, RpcEndpoint } from "../consts";
  import { createEventDispatcher } from "svelte";
  import { push } from "svelte-spa-router";
  import { connectedWallet } from "../stores/singletons/connectedWallet";
  import { connectedWalletAddress } from "../stores/singletons/connectedWalletAddress";
  import Frame from "../components/Frame.svelte";
  import Web3 from "web3";
  import { web3 } from "../stores/singletons/web3";

  const injected = injectedModule();
  const walletConnect = walletConnectModule();

  const wallets = [injected, walletConnect];

  const chains = [
    {
      id: "0x64",
      token: "xDai",
      label: "Gnosis Chain",
      rpcUrl: RpcEndpoint,
    },
  ];

  const appMetadata = {
    name: AppName,
    icon: AppIcon,
    description: AppDescription,
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
      { name: "Rabby", url: "https://rabby.io/" },
    ],
  };

  const onboard = Onboard({
    wallets,
    chains,
    appMetadata,
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
    if (!wallet) {
      return;
    }
    console.info("Connected to wallet:", wallet.label);
    console.info("Connected wallet address:", wallet.accounts[0].address);
    connectedWalletAddress.set(wallet.accounts[0].address);
    connectedWallet.set(wallet);
    const web3Instance = new Web3(wallet.provider);
    console.log("web3Instance", web3Instance);
    web3.set(web3Instance);
    push("/connect-circles-safe");
  };

  const disconnect = ({ label }) => {
    onboard.disconnectWallet({ label });
    console.info("Disconnected from wallet:", label);
    web3.set(undefined);
    connectedWallet.set(undefined);
    connectedWalletAddress.set(undefined);
  };
</script>

<Frame backgroundColor="bg-black">
  <div>
    <div class="text-center">
      <h1 class="mb-2 text-5xl font-bold">Connect your wallet</h1>
      <p class="mb-5">
        Connect the EOA you want to use to interact with your Circles account.
      </p>
    </div>
    <div class="text-center">
      {#if $connectedWallet}
        <div>
          <div class="mb-5 text-sm font-bold sm:text-lg">
            {$connectedWalletAddress}
          </div>
          <div class="mb-5 font-bold text">
            Connected to {$connectedWallet?.label}
          </div>
          <button
            class="mb-5 btn btn-secondary"
            on:click={() => {
              disconnect($connectedWallet);
            }}>Disconnect</button
          ><br />
          <button
            class="btn btn-primary"
            on:click={() => {
              push("/connect-circles-safe");
            }}>Select safe</button
          >
        </div>
      {:else}
        <div>
          <button on:click={connect} class="btn btn-outline">Connect</button>
        </div>
      {/if}
    </div>
  </div>
</Frame>
