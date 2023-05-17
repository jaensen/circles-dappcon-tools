<script lang="ts">
  import SvelteSimplebar from "./molecules/SimpleBar.svelte";
  export let backgroundColor: string = "bg-blue";

  let scrollContent;
  const initBar = (bar) => {
    scrollContent = bar;
  };
</script>

<div
  id="frameContentContainer"
  class="w-full p-2 pb-0 min-h-screen overflow-hidden frameContentContainer {backgroundColor}"
>
  <div class="w-full frameContent">
    <div id="modalScrollable" class="frameContentScrollable">
      <div class="absolute top-0 py-2.5 px-5 {backgroundColor} w-full z-0">
        <a href="/">
          <img
            src="/images/dappconf-blue.png"
            class="w-[60px]"
            alt="DappConf"
          />
        </a>
      </div>
      <SvelteSimplebar init={initBar}>
        <div class="w-full m-auto mt-24 overflow-hidden text-primary">
          <slot />
        </div>
      </SvelteSimplebar>
    </div>
  </div>
</div>

<style>
  .frameContentContainer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 5rem;
  }

  .frameContent {
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    @apply text-center;
    @apply text-primary;
  }

  .frameContentScrollable {
    flex-grow: 1;
    /* overflow: hidden; */
    min-height: 0;
  }
</style>
