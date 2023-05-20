<script lang="ts">
  import type Web3 from "web3";
  import type {CirclesSafe} from "../models/circlesSafe";
  import {createMintHoGStore} from "../stores/factories/tx/createMintHoGStore";
  import {createFindPaymentPath} from "../stores/factories/queries/createFindPaymentPath";
  import {HoGTokenAddress} from "../consts";
  import {writable} from "svelte/store";
  import ActionButton from "../components/ActionButton.svelte";
  import {crcToTc} from "@jaensen/timecircles";
  import {ExecutionState} from "../models/executionState";

  export let web3: Web3;
  export let circlesSafe: CirclesSafe;
  export let mintAmount: string;
  export let anchorElementId = "YouMint";

  $: mintAmountInTc = mintAmount ? crcToTc(Date.now(), parseFloat(mintAmount)).toFixed(2) : "--";

  function actionFactory() {
      const mintHog = writable({ state: ExecutionState.None, status: '' });
      let paymentPath = createFindPaymentPath();
      const mintAmountInWei = web3.utils.toWei(mintAmount.toString(), 'ether');

      paymentPath.search({
          web3: web3,
          amount: mintAmountInWei,
          from: circlesSafe.safeAddress,
          to: HoGTokenAddress
      });

      mintHog.set({ state: ExecutionState.Initializing, status: 'Finding the transfer path ...' });

      paymentPath.subscribe(path => {
          if (path.error) {
              mintHog.set({ state: ExecutionState.Error, status: path.error.message });
              return;
          }
          if (!path.result) {
              return;
          }
          console.log(path.result);

          const mintHogTxStore = createMintHoGStore(web3, circlesSafe, path.result);
          mintHogTxStore.subscribe(txStatus => {
              mintHog.set(txStatus);
          });
      });

      return mintHog;
  }
</script>

<div id={anchorElementId} />
<ActionButton title={`Mint ${mintAmount} HoG`}
              description={`You're about to mint ${mintAmount} HoG in exchange for ${mintAmountInTc} Circles.`}
              actionButtonText="Mint"
              allowRetry={true}
              actionFactory={actionFactory} />
