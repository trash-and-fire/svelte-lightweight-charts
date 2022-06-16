<script lang="ts">
    import type {Context} from './utils.js';
    import {context} from './utils.js';

    export let value: Context;

    $: context(value);
</script>
<slot/>
