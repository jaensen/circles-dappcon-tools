<script lang="ts">
    import { selectedSafe } from "../stores/singletons/selectedSafe";
    import HoGBalance from "../pages/HoGBalance.svelte";
</script>

<HoGBalance circlesSafe={$selectedSafe} />
<div class="hero min-h-screen bg-primary">
    <div class="hero-content text-center text-neutral-content">
        <div class="form-control">
            <label class="label">
                <span class="label-text">Transfer amount</span>
            </label>
            <label class="input-group">
                <input
                    type="text"
                    placeholder="0"
                    class="input input-bordered"
                />
                <span class="text-primary">HoG</span>
            </label>
        </div>
    </div>
</div>
