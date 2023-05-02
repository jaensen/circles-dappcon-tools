<script>
</script>

<div class="hero min-h-screen" style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
            <p class="mb-5">This tool connects your familiar Wallet to your Circles Safe.</p>
            <button class="btn btn-primary" on:click={() => {
                document.location.hash = '-';
                document.location.hash = 'seedphrase'
            }}>Get started</button>
        </div>
    </div>
</div>
