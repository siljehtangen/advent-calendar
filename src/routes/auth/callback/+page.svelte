<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { createClient } from '$lib/supabase/client';
	import { browser } from '$app/environment';

	const supabase = createClient();
	let loading = $state(true);
	let error = $state<string | null>(null);
	let success = $state(false);

	onMount(async () => {
		if (!browser) return;

		// Handle email confirmation from magic link
		const hashParams = new URLSearchParams(window.location.hash.substring(1));
		const accessToken = hashParams.get('access_token');
		const refreshToken = hashParams.get('refresh_token');
		const type = hashParams.get('type');

		if (accessToken && refreshToken) {
			const { error: sessionError } = await supabase.auth.setSession({
				access_token: accessToken,
				refresh_token: refreshToken
			});

			if (sessionError) {
				error = sessionError.message;
				loading = false;
				setTimeout(() => goto('/'), 5000);
				return;
			}

			success = true;
			loading = false;
			
			// Clear the hash from URL
			window.history.replaceState(null, '', window.location.pathname);
			
			// Redirect to home page after a moment
			setTimeout(() => {
				window.location.href = '/';
			}, 2000);
		} else {
			// Check for code in query params (for server-side redirect flow)
			const code = new URLSearchParams(window.location.search).get('code');
			if (code) {
				// Code will be handled by server route, just wait
				loading = false;
			} else {
				// No valid auth tokens found
				error = 'Ingen gyldig autentiseringskode funnet.';
				loading = false;
				setTimeout(() => {
					window.location.href = '/';
				}, 3000);
			}
		}
	});
</script>

<div class="callback-container">
	{#if loading}
		<div class="loading">
			<div class="spinner"></div>
			<p>Bekrefter e-post...</p>
		</div>
	{:else if success}
		<div class="success">
			<p class="success-icon">✅</p>
			<p class="success-text">E-post bekreftet!</p>
			<p class="success-hint">Omdirigerer til julekalenderen...</p>
		</div>
	{:else if error}
		<div class="error">
			<p class="error-icon">❌</p>
			<p class="error-text">{error}</p>
			<p class="error-hint">Omdirigerer til hjemmesiden...</p>
		</div>
	{/if}
</div>

<style>
	.callback-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.loading {
		text-align: center;
	}

	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid rgba(255, 255, 255, 0.1);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin: 0 auto 1rem;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.loading p {
		color: var(--color-text-dim);
		font-size: 0.95rem;
	}

	.success {
		text-align: center;
		padding: 2rem;
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.3);
		border-radius: 12px;
		max-width: 400px;
	}

	.success-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.success-text {
		color: var(--color-text);
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.success-hint {
		color: var(--color-text-dim);
		font-size: 0.85rem;
	}

	.error {
		text-align: center;
		padding: 2rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 12px;
		max-width: 400px;
	}

	.error-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.error-text {
		color: var(--color-text);
		font-size: 1rem;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.error-hint {
		color: var(--color-text-dim);
		font-size: 0.85rem;
	}
</style>


