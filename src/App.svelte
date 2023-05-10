<script lang="ts">
    import "./app.css";
    import Router from "svelte-spa-router";

    import ConnectCirclesSafe from "./routes/ConnectCirclesSafe.svelte";
    import ConnectWallet from "./pages/ConnectWallet.svelte";
    import CreateCirclesSafe from "./routes/CreateCirclesSafe.svelte";
    import ImportCirclesSafe from "./routes/ImportCirclesSafe.svelte";
    import MintHoG from "./routes/MintHoG.svelte";
    import Home from "./routes/Home.svelte";
    import TransferHog from "./routes/TransferHog.svelte";

    const routes = {
        "/": Home,
        "/connect-wallet": ConnectWallet,
        "/connect-circles-safe": ConnectCirclesSafe,
        "/import-circles-safe": ImportCirclesSafe,
        "/create-circles-safe": CreateCirclesSafe,
        "/mint-hog": MintHoG,
        "/transfer-hog": TransferHog,
    };
</script>

<Router {routes} />
