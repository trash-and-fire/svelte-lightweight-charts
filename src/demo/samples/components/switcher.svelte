<script lang="ts">
    export let list: string[] = []
    export let value: string | undefined;
</script>
<style>
    .switcher {
        display: flex;
        align-items: center;
        height: 30px;
        margin-top: 8px;
        color: #2196F3;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        font-size: 14px;
    }

    .switcher-item {
        position: relative;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        padding: 6px 8px;
        font-size: 14px;
        color: #262b3e;
        background-color: transparent;
        margin-right: 8px;
        border: none;
        border-radius: 4px;
        outline: none;
    }

    .switcher-item:hover {
        background-color: #f2f3f5;
    }

    .switcher-item.active {
        text-decoration: none;
        cursor: default;
        color: #262b3e;
    }

    .switcher-item.active,
    .switcher-item.active:hover {
        background-color: #e1eff9;
    }

    .input {
        appearance: none;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: 0;
        padding: 0;
        opacity: 0;
    }
</style>
<div class="switcher">
    {#each list as font}
        <label class="switcher-item" class:active={value === font}>
            {font}
            <input class="input" type="radio" name="font-family" value={font} bind:group={value}>
        </label>
    {/each}
</div>
