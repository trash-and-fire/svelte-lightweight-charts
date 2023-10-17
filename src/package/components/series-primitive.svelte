<svelte:options immutable={true}/>

<script lang="ts">
    import type {$$PROPS} from './series-primitive.interface.js';

    import {useSeriesPrimitiveEffect} from './internal/utils.js';

    export let view: $$PROPS['view'];
    export let options: $$PROPS['options'];

    useSeriesPrimitiveEffect(() => [{ view, options }]);
</script>
