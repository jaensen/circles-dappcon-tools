<script lang="ts">
    import { CirclesSafe } from "../../models/circlesSafe";

    export let circlesSafe: CirclesSafe;
</script>

<a on:click class="flex p-3">
    <img
        class="flex-none w-12 h-full"
        src={circlesSafe.userAvatar ?? "/images/blank-avatar.png"}
        alt="user avatar"
    />
    <div class="flex-grow text-neutral-content truncate">
        <div class="text-xl ml-2 truncate">{circlesSafe.safeAddress}</div>
        <div class="text-sm ml-2 truncate">
            {circlesSafe.userName ?? "no username"}
        </div>
    </div>
</a>
