<script lang="ts">
	import '../app.css';
	import Snowfall from '$lib/components/Snowfall.svelte';
	import { session as sessionStore } from '$lib/stores';
	import { createClient } from '$lib/supabase/client';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	let { children, data }: { children: any; data: PageData } = $props();

	const supabase = createClient();

	if (browser) {
		sessionStore.set(data.session);
	}

	onMount(() => {
		supabase.auth.onAuthStateChange((_event, session) => {
			sessionStore.set(session);
		});
	});
</script>

<Snowfall />
{@render children()}

