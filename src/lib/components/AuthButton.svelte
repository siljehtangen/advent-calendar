<script lang="ts">
	import { createClient } from '$lib/supabase/client';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let { session } = $props<{ session: any }>();

	const supabase = createClient();
	
	let email = $state('');
	let loading = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);
	let magicLinkSent = $state(false);
	let magicLinkUrl = $state<string | null>(null);

	async function sendMagicLink() {
		if (!browser) return;
		
		if (!email || !email.includes('@')) {
			message = { type: 'error', text: 'Vennligst skriv inn en gyldig e-postadresse' };
			return;
		}

		loading = true;
		message = null;

		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback`,
				shouldCreateUser: true
			}
		});

		loading = false;

		if (error) {
			message = { type: 'error', text: error.message || 'Kunne ikke sende magisk lenke' };
			return;
		}

		// Get the magic link from the email (Supabase sends it in the email)
		magicLinkSent = true;
		message = { 
			type: 'success', 
			text: 'Sjekk e-posten din! Vi har sendt deg en magisk lenke. Klikk på lenken i e-posten for å logge inn.' 
		};
	}

	async function signOut() {
		await fetch('/auth/logout', { method: 'POST' });
		await supabase.auth.signOut();
		goto('/');
	}

	function resetForm() {
		email = '';
		magicLinkSent = false;
		message = null;
	}
</script>

{#if session}
	<div class="auth-section">
		<div class="user-info">
			<span class="user-icon">👤</span>
			<span class="user-email">{session.user.email}</span>
		</div>
		<div class="magic-link-info">
			<p class="info-text">
				💡 <strong>Tips:</strong> Lagre denne lenken for å komme tilbake til din julekalender senere:
			</p>
			<div class="link-container">
				<input 
					type="text" 
					readonly 
					value={window.location.href}
					class="magic-link-input"
					id="magic-link-input"
				/>
				<button 
					class="copy-btn" 
					onclick={() => {
						const input = document.getElementById('magic-link-input') as HTMLInputElement;
						input?.select();
						document.execCommand('copy');
						message = { type: 'success', text: 'Lenke kopiert!' };
						setTimeout(() => message = null, 2000);
					}}
				>
					📋 Kopier
				</button>
			</div>
		</div>
		<button class="logout-btn" onclick={signOut}>
			<span class="logout-icon">🚪</span>
			Logg ut
		</button>
	</div>
{:else}
	<div class="auth-section">
		<p class="auth-prompt">Logg inn for å lagre fremgangen din</p>
		
		{#if !magicLinkSent}
			<form 
				class="auth-form" 
				onsubmit={(e) => {
					e.preventDefault();
					sendMagicLink();
				}}
			>
				<div class="input-group">
					<label for="email-input" class="input-label">E-postadresse</label>
					<input
						id="email-input"
						type="email"
						placeholder="din@epost.no"
						bind:value={email}
						disabled={loading}
						class="email-input"
						required
					/>
				</div>
				
				<button 
					type="submit" 
					class="auth-btn" 
					disabled={loading}
				>
					{#if loading}
						<span class="spinner"></span>
						Sender...
					{:else}
						<span class="email-icon">📧</span>
						Send magisk lenke
					{/if}
				</button>
			</form>
		{:else}
			<div class="success-message">
				<div class="success-icon">✅</div>
				<p class="success-text">
					Vi har sendt en magisk lenke til <strong>{email}</strong>
				</p>
				<p class="success-hint">
					Klikk på lenken i e-posten din for å logge inn. Du kan også lagre lenken for å bruke den flere ganger.
				</p>
				<button class="back-btn" onclick={resetForm}>
					Send til en annen e-post
				</button>
			</div>
		{/if}

		{#if message}
			<div class="message" class:error={message.type === 'error'} class:success={message.type === 'success'}>
				{message.text}
			</div>
		{/if}
	</div>
{/if}

<style>
	.auth-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 0;
		width: 100%;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--color-text);
		font-size: 0.95rem;
	}

	.user-icon {
		font-size: 1.2rem;
	}

	.user-email {
		font-weight: 500;
	}

	.magic-link-info {
		width: 100%;
		margin-top: 0.5rem;
		padding: 1rem;
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.3);
		border-radius: 8px;
	}

	.info-text {
		font-size: 0.85rem;
		color: var(--color-text-dim);
		margin-bottom: 0.75rem;
		line-height: 1.4;
	}

	.link-container {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.magic-link-input {
		flex: 1;
		padding: 0.5rem;
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 6px;
		color: var(--color-text);
		font-size: 0.8rem;
		font-family: monospace;
	}

	.copy-btn {
		padding: 0.5rem 0.75rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 6px;
		color: var(--color-text);
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.copy-btn:hover {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.logout-btn {
		padding: 0.6rem 1.25rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 8px;
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.logout-btn:hover {
		background: rgba(239, 68, 68, 0.2);
		border-color: rgba(239, 68, 68, 0.5);
	}

	.logout-icon {
		font-size: 1rem;
	}

	.auth-prompt {
		color: var(--color-text-dim);
		font-size: 1rem;
		text-align: center;
		margin: 0 0 1.5rem 0;
		font-weight: 500;
		opacity: 0.9;
	}

	.auth-form {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.input-group {
		position: relative;
	}

	.input-label {
		font-size: 0.9rem;
		color: var(--color-text-dim);
		font-weight: 500;
		margin-bottom: 0.75rem;
		display: block;
	}

	.email-input {
		padding: 1rem 1.25rem;
		background: rgba(255, 255, 255, 0.06);
		border: 2px solid rgba(255, 255, 255, 0.15);
		border-radius: 12px;
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: 1rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		width: 100%;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.email-input:hover:not(:disabled) {
		border-color: rgba(255, 255, 255, 0.25);
		background: rgba(255, 255, 255, 0.08);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.email-input:focus {
		outline: none;
		border-color: var(--color-primary);
		background: rgba(255, 255, 255, 0.1);
		box-shadow: 
			0 4px 16px rgba(0, 0, 0, 0.2),
			0 0 0 4px rgba(255, 213, 79, 0.1),
			0 0 20px rgba(255, 213, 79, 0.2);
		transform: translateY(-2px);
	}

	.email-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.auth-btn {
		padding: 1rem 2rem;
		border: 2px solid rgba(255, 213, 79, 0.3);
		border-radius: 12px;
		background: linear-gradient(135deg, 
			rgba(255, 213, 79, 0.15) 0%,
			rgba(255, 213, 79, 0.1) 100%
		);
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		width: 100%;
		position: relative;
		overflow: hidden;
		box-shadow: 
			0 4px 12px rgba(0, 0, 0, 0.2),
			0 0 20px rgba(255, 213, 79, 0.1);
	}

	.auth-btn::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, 
			rgba(255, 213, 79, 0.2) 0%,
			rgba(255, 213, 79, 0.1) 100%
		);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.auth-btn:hover:not(:disabled)::before {
		opacity: 1;
	}

	.auth-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, 
			rgba(255, 213, 79, 0.25) 0%,
			rgba(255, 213, 79, 0.15) 100%
		);
		border-color: rgba(255, 213, 79, 0.5);
		transform: translateY(-3px);
		box-shadow: 
			0 8px 20px rgba(0, 0, 0, 0.3),
			0 0 30px rgba(255, 213, 79, 0.2);
	}

	.auth-btn:active:not(:disabled) {
		transform: translateY(-1px);
	}

	.auth-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.email-icon {
		font-size: 1.1rem;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: var(--color-text);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.success-message {
		width: 100%;
		text-align: center;
		padding: 2rem 1.5rem;
		background: linear-gradient(135deg, 
			rgba(34, 197, 94, 0.1) 0%,
			rgba(34, 197, 94, 0.05) 100%
		);
		border: 2px solid rgba(34, 197, 94, 0.3);
		border-radius: 16px;
		animation: successAppear 0.5s ease-out;
	}

	@keyframes successAppear {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.success-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
		animation: bounceIn 0.6s ease-out;
	}

	@keyframes bounceIn {
		0% {
			opacity: 0;
			transform: scale(0.3);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.success-text {
		color: var(--color-text);
		font-size: 1.05rem;
		margin-bottom: 0.75rem;
		font-weight: 500;
	}

	.success-hint {
		color: var(--color-text-dim);
		font-size: 0.95rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.back-btn {
		padding: 0.75rem 1.5rem;
		background: rgba(255, 255, 255, 0.06);
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-radius: 10px;
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.back-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.message {
		width: 100%;
		padding: 1rem 1.25rem;
		border-radius: 12px;
		font-size: 0.95rem;
		text-align: center;
		font-weight: 500;
		animation: messageSlideIn 0.4s ease-out;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	@keyframes messageSlideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.message.error {
		background: linear-gradient(135deg, 
			rgba(239, 68, 68, 0.15) 0%,
			rgba(239, 68, 68, 0.1) 100%
		);
		border: 2px solid rgba(239, 68, 68, 0.4);
		color: #fca5a5;
	}

	.message.success {
		background: linear-gradient(135deg, 
			rgba(34, 197, 94, 0.15) 0%,
			rgba(34, 197, 94, 0.1) 100%
		);
		border: 2px solid rgba(34, 197, 94, 0.4);
		color: #86efac;
	}

	@media (max-width: 600px) {
		.auth-section {
			padding: 1.25rem;
			margin-top: 1rem;
		}

		.auth-btn {
			padding: 0.65rem 1.25rem;
			font-size: 0.85rem;
		}

		.user-email {
			font-size: 0.85rem;
		}

		.magic-link-input {
			font-size: 0.7rem;
		}

		.copy-btn {
			font-size: 0.7rem;
			padding: 0.5rem;
		}
	}
</style>
