<script lang="ts">
  export let onContinue: () => void;
</script>

<div class="flex flex-col px-10 items-center">
  <div class="flex justify-center mb-16">
    <img src="/images/dappcon23.png" alt="DappConf" />
  </div>
  <div class="text-primary flex text-left max-w-[625px]">
    DappCon 2023 will expand on the previous year's focus on Universal Basic
    Income (UBI) by allowing attendees to purchase their event ticket using
    Circles UBI. To purchase a DappCon ticket, you need to convert your Circles
    UBI into "Human of Gnosis" Tokens.
  </div>
  <div class="text-primary my-10 text-left max-w-[625px]">
    This app provides a step-by-step guide on how to purchase a DappCon ticket
    using your Circles Account.
  </div>
  <div>
    <button
      class="btn btn-clasic btn-outline text-primary rounded-full w-80"
      on:click={() => onContinue?.()}>Get started</button
    >
  </div>
  <div class="text-primary mt-10 text-left max-w-[625px]">
    For a detailed description, please refer to our blog post where we provide
    comprehensive information on how to use this app to purchase a DappCon
    ticket with your Circles Account.
  </div>
</div>
