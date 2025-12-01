<script lang="ts">
	import '../app.css';
	import Snowfall from '$lib/components/Snowfall.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	let { children, data }: { children: any; data: PageData } = $props();
</script>

<Snowfall />
{@render children()}
