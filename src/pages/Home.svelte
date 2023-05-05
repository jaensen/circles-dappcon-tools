<script lang="ts">

    fetch("https://dev.api.circlesubi.id/", {
        "headers": {
            "content-type": "application/json",
        },
        "body": "{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  profilesBySafeAddress(\\n    safeAddresses: \\\"0x123\\\"\\n  ) {\\n    circlesAddress\\n    balances {\\n      crcBalances {\\n        lastUpdatedAt\\n        total\\n      }\\n    }\\n  }\\n}\\n\"}",
        "method": "POST"
    }).then(o => console.log(o));
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
