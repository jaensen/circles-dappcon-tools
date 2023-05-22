<script lang="ts">
    import type { Readable } from "svelte/store";
    import { readable } from "svelte/store";
    import type { ActionStatus } from "../models/executionState";
    import { ExecutionState } from "../models/executionState";

    export let title: string;
    export let description: string;
    export let actionButtonText: string;
    export let actionFactory: () =>
        | Readable<ActionStatus>
        | Promise<Readable<ActionStatus>>;
    export let allowRetry = false;
    export let initialMessage = "";
    export let onDone: (actionStatus: ActionStatus) => void;

    let actionStatus: Readable<ActionStatus> = readable({
        state: ExecutionState.None,
        status: initialMessage,
    });

    const isProcessing = (state: ExecutionState) => {
        return (
            state !== ExecutionState.None &&
            state !== ExecutionState.Success &&
            state !== ExecutionState.Error
        );
    };

    async function onButtonClicked() {
        const store = actionFactory();
        if (store instanceof Promise) {
            actionStatus = await store;
        } else {
            actionStatus = store;
        }
        let unsubscribe = actionStatus.subscribe((status) => {
            if (
                status.state === ExecutionState.Success ||
                status.state === ExecutionState.Error
            ) {
                unsubscribe();
            }
            if (status.state === ExecutionState.Success && onDone) {
                onDone(status);
            }
        });
    }
</script>

<h1 class="mb-5 text-5xl font-bold text-primary">{title}</h1>
{#if $actionStatus.state === ExecutionState.None}
    <p class="mb-5 text-primary">{description}</p>
    <div class="items-center form-control">
        <button
            on:click={onButtonClicked}
            class="bg-black rounded-full w-80 btn btn-primary text-primary"
            >{actionButtonText}</button
        >
    </div>
{:else if isProcessing($actionStatus.state)}
    {#if $actionStatus.status && $actionStatus.status.trim() !== ""}
        <div class="mb-4">
            <div class="loader">
                <div class="loaderBar" />
            </div>
            <p class="text-info">
                {$actionStatus.status}
            </p>
        </div>
    {/if}
{:else if $actionStatus.state === ExecutionState.Success}
    <p class="text-success text-primary">Action completed successfully.</p>
{:else if $actionStatus.state === ExecutionState.Error && allowRetry}
    <div class="items-center form-control">
        <p class="text-error mb-5">{$actionStatus.status}</p>
        <button
            on:click={onButtonClicked}
            class="bg-black btn btn-primary text-primary rounded-full w-80"
            >Retry: {actionButtonText}</button
        >
    </div>
{/if}
