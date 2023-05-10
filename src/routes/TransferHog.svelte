<script lang="ts">
    import {selectedSafe} from "../stores/singletons/selectedSafe";
    import HoGBalance from "../pages/HoGBalance.svelte";
</script>

<HoGBalance circlesSafe={$selectedSafe}/>
<div class="hero min-h-screen" style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
        <div class="form-control">
            <label class="label">
                <span class="label-text">Transfer amount</span>
            </label>
            <label class="input-group">
                <input type="text"
                       placeholder="0"
                       class="input input-bordered"/>
                <span>HoG</span>
            </label>
        </div>
    </div>
</div>
