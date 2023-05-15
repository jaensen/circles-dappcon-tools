<script lang="ts">
    import { CirclesSafe } from "../../models/circlesSafe";

    export let circlesSafe: CirclesSafe;
</script>

<div on:click class="flex truncate">
    <div class="shrink-0 mr-2.5">
        <img
            class="w-12 h-auto"
            src={circlesSafe.userAvatar ?? "/images/blank-avatar.png"}
            alt="user avatar"
        />
    </div>
    <div class="grow text-neutral-content truncate">
        <div class="text-xl ml-2 truncate">{circlesSafe.safeAddress}</div>
        <div class="text-sm ml-2 truncate">
            {circlesSafe.userName ?? "no username"}
        </div>
    </div>
</div>
