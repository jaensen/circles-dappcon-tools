<script lang="ts">
    import {mnemonicToEntropy, validateMnemonic} from "bip39";
    import Web3 from "web3";

    export let isValidMnemonic: boolean = false;
    export let mnemonicPhrase: string = "";
    export let privateKey: string = "";
    export let address: string = "";

    let boxes: string[] = Array(24).fill("");

    function onInput() {
        if (validateMnemonic(boxes[0].trim())) {
            boxes[0].split(" ").forEach((word, i) => {
                boxes[i] = word.trim();
                boxes = boxes;
            });
        }
        validate();
    }

    function validate() {
        const phrase = boxes.join(" ");
        isValidMnemonic = validateMnemonic(phrase);
        if (isValidMnemonic) {
            const keyFromMnemonic = mnemonicToEntropy(phrase);
            const wallet = new Web3().eth.accounts.privateKeyToAccount(keyFromMnemonic);
            mnemonicPhrase = phrase;
            address = wallet.address;
            privateKey = wallet.privateKey;
        } else {
            privateKey = "";
        }
    }
</script>
<div>
<div class="flex flex-wrap">
    {#each boxes as box, i}
        <div class="form-control">
            <label class="input-group m-4">
                <span>{(i + 1).toString().padStart(2, "0")}</span>
                <input type="text"
                       class="input input-bordered w-36"
                       class:text-error={!isValidMnemonic}
                       class:text-success={isValidMnemonic}
                       bind:value={boxes[i]}
                       on:change={onInput}
                       on:keyup={onInput} />
            </label>
        </div>
    {/each}
</div>
</div>
