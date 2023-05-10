<script lang="ts">
    import Safe, { Web3Adapter } from "@safe-global/protocol-kit";
    import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
    import Web3 from "web3";
    import { HUB_ABI } from "../abis/hub";
    import { HoGTokenAddress, HubAddress } from "../consts";
    import { CirclesSafe } from "../models/circlesSafe";
    import { GROUP_CURRENCY_TOKEN_ABI } from "../abis/groupCurrencyToken";
    import { crcToTc } from "@jaensen/timecircles";
    import { calculatePaymentPath } from "../api/calculatePaymentPath";
    import type { PaymentPath } from "../models/paymentPath";

    export let web3: Web3;
    export let circlesSafe: CirclesSafe;
    export let mintAmount: number;

    let status: string;
    let isMinting: boolean;
    let isError: boolean;
    let isSuccess: boolean;
    let crcAmount: string;
    let tcAmount: string;

    $: {
        if (mintAmount) {
            crcAmount = Web3.utils.toWei(mintAmount.toString(), "ether");
            tcAmount = crcToTc(Date.now(), mintAmount).toFixed(2);
        }
    }

    async function generateTransferThroughCallData(
        path: PaymentPath
    ): Promise<MetaTransactionData> {
        const hubContractCallArgs = path.path.reduce(
            (p, c) => {
                p.tokenOwners.push(c.tokenOwner);
                p.srcs.push(c.from);
                p.dests.push(c.to);
                p.wads.push(c.value);
                return p;
            },
            {
                tokenOwners: [],
                srcs: [],
                dests: [],
                wads: [],
            }
        );

        const hubContract = new web3.eth.Contract(HUB_ABI, HubAddress);
        const transferThroughData = hubContract.methods
            .transferThrough(
                hubContractCallArgs.tokenOwners,
                hubContractCallArgs.srcs,
                hubContractCallArgs.dests,
                hubContractCallArgs.wads
            )
            .encodeABI();

        return {
            to: HubAddress,
            value: "0",
            data: transferThroughData,
            operation: 0,
        };
    }

    async function generateMintCallData(
        path: PaymentPath
    ): Promise<MetaTransactionData> {
        const pathEnds = path.path.filter(
            (o) => o.to.toLowerCase() == HoGTokenAddress.toLowerCase()
        );
        const collateralTokenOwners = pathEnds.map((o) => o.tokenOwner);

        const hubContract = new web3.eth.Contract(HUB_ABI, HubAddress);
        const collateralTokens = await Promise.all(
            collateralTokenOwners.map((collateralTokenOwner) =>
                hubContract.methods.userToToken(collateralTokenOwner).call()
            )
        );

        const groupCurrencyContract = new web3.eth.Contract(
            GROUP_CURRENCY_TOKEN_ABI,
            HoGTokenAddress
        );
        const mintData = groupCurrencyContract.methods
            .mint(
                collateralTokens,
                pathEnds.map((o) => Web3.utils.toBN(o.value))
            )
            .encodeABI();

        return {
            to: HoGTokenAddress,
            value: "0",
            data: mintData,
            operation: 0,
        };
    }

    async function mintHoG(mintAmount: number) {
        try {
            isSuccess = false;
            isError = false;
            isMinting = true;
            status = "Initializing safe sdk...";

            const ethAdapter = new Web3Adapter({
                web3,
                signerAddress: circlesSafe.ownerAddress,
            });

            const safe: Safe = await Safe.create({
                ethAdapter: ethAdapter,
                safeAddress: circlesSafe.safeAddress,
                isL1SafeMasterCopy: false,
            });

            let safeTransactionData: MetaTransactionData[] = [];

            crcAmount = Web3.utils.toWei(mintAmount.toString(), "ether");
            tcAmount = crcToTc(Date.now(), mintAmount).toFixed(2);

            status = "Calculating collateral transfer path...";
            const path = await calculatePaymentPath(
                circlesSafe.safeAddress,
                HoGTokenAddress,
                crcAmount
            );

            status = "Generating transfer through call data...";
            safeTransactionData.push(
                await generateTransferThroughCallData(path)
            );

            status = "Generating mint call data...";
            safeTransactionData = safeTransactionData.concat([
                await generateMintCallData(path),
            ]);

            status = "Creating safe transaction...";
            const safeTransaction = await safe.createTransaction({
                safeTransactionData,
            });

            status = "Signing safe transaction...";
            const signedSafeTransaction = await safe.signTransaction(
                safeTransaction
            );

            status = "Sending safe transaction...";
            const transactionResult = await safe.executeTransaction(
                signedSafeTransaction
            );

            status = `Safe transaction sent.<br/><a href="https://gnosisscan.io/tx/${transactionResult.hash}">Open on GnosisScan</a>`;
            isMinting = false;
            isSuccess = true;
        } catch (e) {
            console.error(e);
            isError = true;
            status = e.message;
            isSuccess = false;
        } finally {
            isMinting = false;
        }
    }
</script>

<div class="hero min-h-screen bg-primary">
    <div class="hero-content text-center text-neutral-content">
        <div>
            {#if mintAmount && crcAmount && tcAmount}
                <p class="text-primary">You mint:</p>
                <h1 class="mb-5 text-5xl font-bold text-primary">
                    {mintAmount} HoG
                </h1>
                <p>for</p>
                <h2 class="mb-5 text-2xl font-bold text-primary">
                    {tcAmount} Circles ({Number.parseFloat(
                        web3.utils.fromWei(crcAmount, "ether")
                    ).toFixed(0)} CRC)
                </h2>
            {/if}
            {#if status && status.trim() !== ""}
                {#if !isError && !isSuccess}
                    <progress class="progress w-56" />
                {/if}
                <p class:text-info={!isError} class:text-error={isError}>
                    {@html status}
                </p>
            {/if}
            {#if !isSuccess}
                <div class="form-control">
                    <button
                        disabled={isMinting}
                        on:click={() => mintHoG(mintAmount)}
                        class="btn btn-primary text-primary"
                        >{!isError ? "" : "Retry: "}Mint HoG</button
                    >
                </div>
            {:else}
                <p class="text-success text-primary">
                    Minting completed successfully.
                </p>
            {/if}
        </div>
        <!--
        <FlowGraph/>
        -->
    </div>
</div>
