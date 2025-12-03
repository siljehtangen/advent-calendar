<script lang="ts">
	import '../app.css';
	import Snowfall from '$lib/components/Snowfall.svelte';

	let { children } = $props();
</script>

<Snowfall />
{@render children()}
