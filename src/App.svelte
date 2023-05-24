<script lang="ts">
    import "./app.css";
    import Router, {push, replace} from "svelte-spa-router";
    import { wrap } from "svelte-spa-router/wrap";
    import ConnectWallet from "./pages/ConnectWallet.svelte";
    import CreateCirclesSafe from "./pages/CreateCirclesSafe.svelte";
    import { selectedSafe } from "./stores/singletons/selectedSafe";
    import { connectedWalletAddress } from "./stores/singletons/connectedWalletAddress";
    import Frame from "./components/Frame.svelte";
    import ChooseSafe from "./pages/ChooseSafe.svelte";
    import Actions from "./pages/Actions.svelte";
    import EnterSeedPhrase from "./pages/EnterSeedPhrase.svelte";
    import Home from "./pages/Home.svelte";
    import {importEoaAddress} from "./stores/singletons/importEoaAddress";
    import {importSafe} from "./stores/singletons/importSafe";
    import AddOwnerToSafe from "./pages/AddOwnerToSafe.svelte";
    import {importEoaKey} from "./stores/singletons/importEoaKey";
    import ImportCirclesSafe from "./pages/ImportCirclesSafe.svelte";
    import DeploySafe from "./pages/DeploySafe.svelte";
    import type {CirclesSafe} from "./models/circlesSafe";
    import HubSignup from "./pages/HubSignup.svelte";
    import MintCircles from "./pages/MintCircles.svelte";
    import BalanceAndMaxMintAmount from "./pages/BalanceAndMaxMintAmount.svelte";
    import MintHoG from "./pages/MintHoG.svelte";
    import {web3} from "./stores/singletons/web3";
    import {HoGTokenAddress} from "./consts";

    let bg = "bg-black";

    const routes = {
        "/": wrap({
            component: Home,
            props: {
                onContinue: () => push("/connect-wallet"),
            },
            userData: {
                backgroundColor: "bg-black",
            },
        }),
        "/connect-wallet": wrap({
            component: ConnectWallet,
            props: {
                onWalletConnected: e => {
                    connectedWalletAddress.set(e);
                    push(`/${e}/connect-circles-safe`);
                }
            },
            userData: {
                backgroundColor: "bg-blue",
            },
        }),
        "/:ownerAddress/connect-circles-safe": wrap({
            component: ChooseSafe,
            props: {
                onSafeSelected: e => {
                    selectedSafe.set(e);
                    push(`/${$connectedWalletAddress}/${e.safeAddress}`);
                },
                onImport: () => push(`/${$connectedWalletAddress}/import-circles-safe`),
                onSignup: () => push(`/${$connectedWalletAddress}/create-circles-safe`),
                showImport: () => true,
                showSignup: () => true,
            },
            conditions: [
                () => !!$connectedWalletAddress,
            ],
            userData: {
                backgroundColor: "bg-black",
            },
        }),
        "/:ownerAddress/import-circles-safe": wrap({
            component: ImportCirclesSafe,
            props: {
                onContinue: () => push(`/${$connectedWalletAddress}/import-circles-safe/seedphrase`),
            },
            conditions: [
                () => !!$connectedWalletAddress,
            ],
            userData: {
                backgroundColor: "bg-blue",
            },
        }),
        "/:ownerAddress/import-circles-safe/seedphrase": wrap({
            component: EnterSeedPhrase,
            props: {
                onEoaLoaded: (eoaAddress: string, privateKey: string) => {
                    importEoaKey.set(privateKey);
                    importEoaAddress.set(eoaAddress);
                    importSafe.set(null);
                    push(`/${$connectedWalletAddress}/import-circles-safe/${eoaAddress}`);
                },
            },
            conditions: [
                () => !!$connectedWalletAddress,
            ],
            userData: {
                backgroundColor: "bg-black",
            },
        }),
        "/:connectedWalletAddress/import-circles-safe/:ownerAddress": wrap({
            component: ChooseSafe,
            props: {
                onSafeSelected: e => {
                    importSafe.set(e);
                    push(`/${$connectedWalletAddress}/import-circles-safe/${$importEoaAddress}/${e.safeAddress}`);
                },
                showImport: () => false,
                showSignup: () => false,
            },
            conditions: [
                () => !!$importEoaAddress && !!$importEoaKey && !!$connectedWalletAddress
            ],
            userData: {
                backgroundColor: "bg-blue",
            },
        }),
        "/:ownerAddress/import-circles-safe/:importEoaAddress/:importSafeAddress": wrap({
            component: AddOwnerToSafe,
            props: {
                privateKey: () => $importEoaKey,
                newOwnerAddress: () => $connectedWalletAddress,
                selectedSafe: () => $importSafe,
                onDone: () => {
                    importEoaKey.set(undefined);
                    importEoaAddress.set(undefined);
                    selectedSafe.set($importSafe);
                    importSafe.set(undefined);

                    push(`/${$connectedWalletAddress}/${$importSafe.safeAddress}`);
                },
            },
            conditions: [
                () => !!$importSafe,
            ],
            userData: {
                backgroundColor: "bg-black",
            },
        }),
        "/:ownerAddress/create-circles-safe": wrap({
            component: CreateCirclesSafe,
            props: {
                onContinue: () => push(`/${$connectedWalletAddress}/create-circles-safe/deploy-safe`),
            },
            conditions: [
                () => !!$connectedWalletAddress,
            ],
            userData: {
                backgroundColor: "bg-blue",
            },
        }),
        "/:ownerAddress/create-circles-safe/deploy-safe": wrap({
            component: DeploySafe,
            props: {
                onDone: (status) => {
                    console.log("/:ownerAddress/create-circles-safe/deploy-safe.status: ", status);
                    const circlesSafe:CirclesSafe = {
                        safeAddress: status.safe.getAddress(),
                        ownerAddress: $connectedWalletAddress,
                        type: "Signup",
                        userName: "",
                        userAvatar: "",
                    };
                    selectedSafe.set(circlesSafe);
                    push(`/${$connectedWalletAddress}/create-circles-safe/${circlesSafe.safeAddress}/signup`);
                },
            },
            conditions: [
                () => !!$connectedWalletAddress,
            ],
            userData: {
                backgroundColor: "bg-black",
            },
        }),
        "/:ownerAddress/create-circles-safe/:safeAddress/signup": wrap({
            component: HubSignup,
            props: {
                safe:() => $selectedSafe,
                onDone: () => push(`/${$connectedWalletAddress}/${$selectedSafe.safeAddress}`),
            },
            conditions: [
                () => !!$connectedWalletAddress && !!$selectedSafe,
            ],
            userData: {
                backgroundColor: "bg-blue",
            },
        }),
        "/:ownerAddress/:safeAddress": wrap({
            component: Actions,
            props: {
                onMintHog: () => push(`/${$connectedWalletAddress}/${$selectedSafe.safeAddress}/mint-hog`),
                onMintCircles: () => push(`/${$connectedWalletAddress}/${$selectedSafe.safeAddress}/mint-crc`),
                onSelectSafe: () => push(`/${$connectedWalletAddress}/connect-circles-safe`),
                onSelectWallet: () => push(`/connect-wallet`),
            },
            conditions: [
                () => !!$connectedWalletAddress && !!$selectedSafe,
            ],
            userData: {
                backgroundColor: "bg-blue",
            },
        }),
        "/:ownerAddress/:safeAddress/mint-hog": wrap({
            component: BalanceAndMaxMintAmount,
            props: {
                web3: () => $web3,
                circlesSafe: () => $selectedSafe,
                toAddress: () => HoGTokenAddress,
                onMint: (mintAmount:string) => push(`/${$connectedWalletAddress}/${$selectedSafe.safeAddress}/mint-hog/${mintAmount}`),
            },
            conditions: [
                () => !!$connectedWalletAddress && !!$selectedSafe,
            ],
            userData: {
                backgroundColor: "bg-black",
            },
        }),
        "/:ownerAddress/:safeAddress/mint-hog/:mintAmount": wrap({
            component: MintHoG,
            props: {
                web3: () => $web3,
                circlesSafe: () => $selectedSafe,
                onDone: () => push(`/${$connectedWalletAddress}/${$selectedSafe.safeAddress}`),
            },
            conditions: [
                () => !!$connectedWalletAddress && !!$selectedSafe,
            ],
            userData: {
                backgroundColor: "bg-black",
            },
        }),
        "/:ownerAddress/:safeAddress/mint-crc": wrap({
            component: MintCircles,
            props: {
                onDone: () => push(`/${$connectedWalletAddress}/${$selectedSafe.safeAddress}`),
                circlesSafe: () => $selectedSafe
            },
            conditions: [
                () => !!$connectedWalletAddress && !!$selectedSafe,
            ],
            userData: {
                backgroundColor: "bg-black",
            },
        })
    };

    function conditionsFailed(event) {
        console.error("conditionsFailed event", event.detail);
        replace("/connect-wallet");
    }
</script>

<Frame backgroundColor={bg}>
    <Router routes={routes}
            on:routeLoading={e => {bg = e.detail.userData.backgroundColor}}
            on:conditionsFailed={conditionsFailed} />
</Frame>
