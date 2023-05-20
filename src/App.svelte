<script lang="ts">
    import "./app.css";
    import Router, { replace } from "svelte-spa-router";
    import { wrap } from "svelte-spa-router/wrap";
    import ConnectCirclesSafe from "./routes/ConnectCirclesSafe.svelte";
    import ConnectWallet from "./pages/ConnectWallet.svelte";
    import CreateCirclesSafe from "./routes/CreateCirclesSafe.svelte";
    import ImportCirclesSafe from "./routes/ImportCirclesSafe.svelte";
    import MintHoG from "./routes/MintHoG.svelte";
    import Home from "./routes/Home.svelte";
    import TransferHog from "./routes/TransferHog.svelte";
    import { selectedSafe } from "./stores/singletons/selectedSafe";
    import { connectedWalletAddress } from "./stores/singletons/connectedWalletAddress";
    import MintCrc from "./routes/MintCrc.svelte";

    const routes = {
        "/": Home,
        "/connect-wallet": ConnectWallet,
        "/connect-circles-safe": wrap({
            component: ConnectCirclesSafe,
            conditions: [
                () => {
                    return $connectedWalletAddress ? true : false;
                },
            ],
        }),
        "/import-circles-safe": wrap({
            component: ImportCirclesSafe,
            conditions: [
                () => {
                    return $connectedWalletAddress ? true : false;
                },
            ],
        }),
        "/create-circles-safe": wrap({
            component: CreateCirclesSafe,
            conditions: [
                () => {
                    return $connectedWalletAddress ? true : false;
                },
            ],
        }),
        "/mint-hog": wrap({
            component: MintHoG,
            conditions: [
                () => {
                    return $selectedSafe ? true : false;
                },
            ],
        }),
        "/mint-crc": wrap({
            component: MintCrc,
            conditions: [
                () => {
                    return $selectedSafe ? true : false;
                },
            ],
        }),
        "/transfer-hog": wrap({
            component: TransferHog,
            conditions: [
                () => {
                    return $selectedSafe ? true : false;
                },
            ],
        }),
    };

    function conditionsFailed(event) {
        console.error("conditionsFailed event", event.detail);
        replace("/connect-wallet");
    }
</script>

<Router {routes} on:conditionsFailed={conditionsFailed} />
