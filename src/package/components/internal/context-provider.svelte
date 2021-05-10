<script lang="ts">
    import type {Context} from '../utils';
    import {context} from '../utils';

    export let value: Context;

    $: context(value);
</script>
<slot/>
