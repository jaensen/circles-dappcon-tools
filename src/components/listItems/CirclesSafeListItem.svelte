<script lang="ts">
  import { type CirclesSafe } from "../../models/circlesSafe";

  export let circlesSafe: CirclesSafe;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class="flex truncate text-primary">
  <div class="shrink-0 mr-2.5">
    <img
      class="w-12 h-auto"
      src={circlesSafe.userAvatar ?? "/images/blank-avatar.png"}
      alt="user avatar"
    />
  </div>
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
