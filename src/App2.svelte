<script lang="ts">
    import "./app.css";
    import Home from "./pages/Home.svelte";
    import { CirclesSafe } from "./models/circlesSafe";
    import ConnectCirclesSafe from "./flows/ConnectCirclesSafe.svelte";
    import Web3 from "web3";
    import Import from "./flows/Import.svelte";
    import Signup from "./flows/Signup.svelte";
    import Actions from "./pages/Actions.svelte";

    let message: string;
    let ownerAddress: string;
    let selectedSafe: CirclesSafe;
    let connectedWalletAddress: string;
    let web3: Web3;
    let mintingGroupCurrency: boolean;

    function eoaConnected(event) {
        const wallet = event.detail;
        connectedWalletAddress = wallet.accounts[0].address;
        web3 = new Web3(event.detail.provider);
    }

    function eoaDisconnected(label) {
        connectedWalletAddress = undefined;
    }

    function onSafeSelected(safe: CirclesSafe) {
        selectedSafe = safe;
        console.log(selectedSafe);
    }

    function onImport() {
        selectedSafe = <CirclesSafe>{
            type: "Import",
        };
    }

    function onSignup() {
        selectedSafe = <CirclesSafe>{
            type: "Signup",
        };
    }

    function onMintHoG() {
        mintingGroupCurrency = true;
    }

    function onImportSuccess(e) {
        onSafeSelected(e.detail);
        alert(
            "Imported safe " +
                selectedSafe.safeAddress +
                " successfully. However it can take a while until it shows up in this application."
        );
    }
</script>

<a name="home" />
{#if !selectedSafe}
    <Home />
{:else if selectedSafe && selectedSafe.type !== "Signup" && selectedSafe.type !== "Import" && !mintingGroupCurrency}
    <Actions {selectedSafe} on:mintHoG={onMintHoG} />
{/if}
{#if !selectedSafe}
    <a name="connect-circles-safe" />
    <ConnectCirclesSafe
        on:import={onImport}
        on:signup={onSignup}
        on:connected={eoaConnected}
        on:disconnected={eoaDisconnected}
        on:safeSelected={onSafeSelected}
    />
{/if}
{#if selectedSafe?.type === "Signup"}
    <Signup />
{/if}
{#if selectedSafe?.type === "Import"}
    <Import
        newOwnerAddress={connectedWalletAddress}
        on:success={onImportSuccess}
    />
{/if}
{#if mintingGroupCurrency && selectedSafe}{/if}
