<script lang="ts">
  import { selectedSafe } from "../stores/singletons/selectedSafe";
  import HoGBalance from "../pages/HoGBalance.svelte";
</script>

<HoGBalance circlesSafe={$selectedSafe} />
<div class="min-h-screen hero bg-primary">
  <div class="text-center hero-content text-neutral-content">
    <div class="form-control">
      <label class="label" for="transferAmount">
        <span class="label-text">Transfer amount</span>
      </label>
      <label class="input-group">
        <input
          id="transferAmount"
          type="text"
          placeholder="0"
          class="input input-bordered"
        />
        <span class="text-primary">HoG</span>
      </label>
    </div>
  </div>
</div>
