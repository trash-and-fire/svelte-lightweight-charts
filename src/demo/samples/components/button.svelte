<script lang="ts">
    export let value: string | undefined;
</script>
<style>
    .wrapper {
        display: flex;
        align-items: center;
        height: 30px;
        margin-top: 8px;
        color: #2196F3;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    .button {
        all: unset;
        appearance: none;
        position: relative;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        padding: 6px 8px;
        font-size: 14px;
        color: #262b3e;
        background-color: #f2f3f5;
        margin-right: 8px;
        border: none;
        border-radius: 4px;
        outline: none;
    }

    .button:hover {
        background-color: #e1eff9;
    }
</style>
<div class="wrapper">
    <input class="button" type="button" value={value} on:click>
</div>
