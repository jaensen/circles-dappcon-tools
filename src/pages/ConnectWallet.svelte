<script lang="ts">
  import Onboard from "@web3-onboard/core";
  import injectedModule from "@web3-onboard/injected-wallets";
  import walletConnectModule from "@web3-onboard/walletconnect";
  import { AppDescription, AppIcon, AppName, RpcEndpoint } from "../consts";
  import { connectedWallet } from "../stores/singletons/connectedWallet";
  import { connectedWalletAddress } from "../stores/singletons/connectedWalletAddress";
  import type Web3 from "web3";
  import { web3 } from "../stores/singletons/web3";

  export let onWalletConnected: (wallet: any) => void;

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

  const connect = async () => {
    const walletState = await onboard.connectWallet();
    const mostRecentWallet = walletState[0];

    if (!mostRecentWallet) {
      return;
    }

    connectedWalletAddress.set(mostRecentWallet.accounts[0].address);
    connectedWallet.set(mostRecentWallet);
    const web3Instance = new Web3((<any>mostRecentWallet).provider);
    web3.set(web3Instance);
    onWalletConnected?.(mostRecentWallet.accounts[0].address);
  };

  const disconnect = ({ label }) => {
    onboard.disconnectWallet({ label });
    web3.set(undefined);
    connectedWallet.set(undefined);
    connectedWalletAddress.set(undefined);
  };
</script>

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
          class="mb-5 btn btn-secondary rounded-full w-80"
          on:click={() => {
            disconnect($connectedWallet);
          }}>Disconnect</button
        ><br />
        <button
          class="btn btn-primary rounded-full w-80"
          on:click={() =>
            onWalletConnected($connectedWallet.accounts[0].address)}
          >Select safe</button
        >
      </div>
    {:else}
      <div>
        <button on:click={connect} class="btn btn-outline rounded-full w-80"
          >Connect</button
        >
      </div>
    {/if}
  </div>
</div>
