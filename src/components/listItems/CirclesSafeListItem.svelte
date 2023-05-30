<script lang="ts">
  import { type CirclesSafe } from "../../models/circlesSafe";
  import jazzicon from "@metamask/jazzicon";
  import { outerHTML } from "../../utils";

  export let circlesSafe: CirclesSafe;

  let noAvatar = jazzicon(50, Math.round(Math.random() * 10));
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class="flex truncate text-primary">
  {#if circlesSafe.userAvatar}
    <div class="shrink-0 mr-2.5">
      <img
        class="rounded-full w-[50px] h-[50px]"
        src={circlesSafe.userAvatar}
        alt="user avatar"
      />
    </div>
  {:else}
    {@html outerHTML(noAvatar)}
  {/if}
  <div>
    <div class="block ml-2 break-all sm:hidden text-md sm:text-xl">
      {circlesSafe.safeAddress.slice(0, 18) + "..."}
    </div>
    <div class="hidden ml-2 break-all sm:block text-md sm:text-xl">
      {circlesSafe.safeAddress}
    </div>
    <div class="ml-2 text-sm text-left truncate text-neutral-content">
      {circlesSafe.userName ?? "no username"}
    </div>
  </div>
</div>
