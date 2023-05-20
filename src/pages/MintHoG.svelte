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
  import { push } from "svelte-spa-router";
  import Frame from "../components/Frame.svelte";
  import {createEventDispatcher} from "svelte";

  export let web3: Web3;
  export let circlesSafe: CirclesSafe;
  export let mintAmount: number;
  export let anchorElementId = "YouMint";

  enum MintingState {
    Idle,
    Minting,
    Error,
    Success
  }

  let mintingState: MintingState = MintingState.Idle;
  let status: string;

  let crcAmount: string;
  let tcAmount: string;
  let transactionReceipt: any;

  const dispatcher = createEventDispatcher();

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

  async function generateTransferMintedHoGToWalletCallData(
    sourceSafeAddress: string,
    targetWalletAddress: string,
    mintAmount: string
  ): Promise<MetaTransactionData> {
    const hogContract = new web3.eth.Contract(
      GROUP_CURRENCY_TOKEN_ABI,
      HoGTokenAddress
    );
    const transferData = hogContract.methods
      .transfer(targetWalletAddress, mintAmount)
      .encodeABI();

    return {
      to: HoGTokenAddress,
      value: "0",
      data: transferData,
      operation: 0,
    };
  }

  async function mintHoG(mintAmount: number) {
    try {
      mintingState = MintingState.Minting;
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
      safeTransactionData.push(await generateTransferThroughCallData(path));

      status = "Generating mint call data...";
      safeTransactionData = safeTransactionData.concat([
        await generateMintCallData(path),
      ]);

      status = "Generate transfer minted HoG to wallet call data...";
      safeTransactionData = safeTransactionData.concat([
        await generateTransferMintedHoGToWalletCallData(
          circlesSafe.safeAddress,
          circlesSafe.ownerAddress,
          crcAmount
        ), // TODO: This won't work if the GC has fees
      ]);

      status = "Creating safe transaction...";
      const safeTransaction = await safe.createTransaction({
        safeTransactionData,
      });

      status = "Signing safe transaction...";
      const signedSafeTransaction = await safe.signTransaction(safeTransaction);

      status = "Sending safe transaction...";
      const transactionResult = await safe.executeTransaction(signedSafeTransaction);

      status = `Waiting for the transaction to be mined ...`
      transactionReceipt = await transactionResult.promiEvent;
      console.log("transactionReceipt:", transactionReceipt);

      status = ``;
      mintingState = MintingState.Success;

      dispatcher("minted", {
          mintAmount,
          crcAmount,
          tcAmount,
      });
    } catch (e) {
      console.error(e);
      mintingState = MintingState.Error;
      status = e.message;
    }
  }
</script>

<div id={anchorElementId} />
<Frame backgroundColor="bg-black">
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
    <div class="mb-4">
      {#if mintingState === MintingState.Minting}
        <div class="loader">
          <div class="loaderBar" />
        </div>
      {/if}
      <p class:text-info={mintingState !== MintingState.Error} class:text-error={mintingState === MintingState.Error}>
        {@html status}
      </p>
    </div>
  {/if}
  {#if mintingState !== MintingState.Success}
    <div class="items-center form-control">
      <button
              disabled={mintingState === MintingState.Minting}
              on:click={() => mintHoG(mintAmount)}
              class="bg-black btn btn-primary text-primary"
      >{mintingState !== MintingState.Error ? "" : "Retry: "}Mint HoG</button
      >
    </div>
  {:else}
    <p class="text-success text-primary">Minting completed successfully.</p>
  {/if}
  {#if mintingState === MintingState.Success && transactionReceipt}
    <button on:click={() => {
        window.open(
          "https://gnosisscan.io/tx/" + transactionReceipt.hash,
          "_blank"
        );
      }}
            class="mt-4 bg-black btn btn-primary text-primary"
    >Open on GnosisScan</button
    ><br />
    <button
            on:click={() => push("/")}
            class="mt-4 bg-black btn btn-primary text-primary">Back</button>
  {/if}
  <!--
        <FlowGraph/>
        -->
</Frame>
