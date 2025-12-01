<script lang="ts">
	import { createClient } from '$lib/supabase/client';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let { session } = $props<{ session: any }>();

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);
	let isLogin = $state(true); // Toggle between login and register

	async function handleSubmit() {
		if (!browser) return;
		
		if (!email || !email.includes('@')) {
			message = { type: 'error', text: 'Vennligst skriv inn en gyldig e-postadresse' };
			return;
		}

		if (!password || password.length < 6) {
			message = { type: 'error', text: 'Passord må være minst 6 tegn' };
			return;
		}

		loading = true;
		message = null;

		// Create client inside function to ensure it's initialized with latest env vars
		const supabase = createClient();

		try {
			if (isLogin) {
				// Login
				const { data, error } = await supabase.auth.signInWithPassword({
					email: email.trim().toLowerCase(),
					password: password
				});

				if (error) {
					message = { type: 'error', text: 'Feil e-post eller passord' };
					loading = false;
					return;
				}

				// Success - session will be updated automatically
				goto('/');
			} else {
				// Register (email confirmation disabled)
				const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
					email: email.trim().toLowerCase(),
					password: password
				});

				if (signUpError) {
					if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists') || signUpError.message.includes('User already registered')) {
						message = { type: 'error', text: 'Denne e-postadressen er allerede registrert. Prøv å logge inn i stedet.' };
					} else {
						message = { type: 'error', text: signUpError.message || 'Kunne ikke opprette bruker' };
					}
					loading = false;
					return;
				}

				// If we have a session, user is automatically logged in (email confirmation disabled)
				if (signUpData.session) {
					goto('/');
					return;
				}

				// If no session, try to log in immediately
				const { error: signInError } = await supabase.auth.signInWithPassword({
					email: email.trim().toLowerCase(),
					password: password
				});

				if (signInError) {
					message = { type: 'error', text: 'Konto opprettet, men kunne ikke logge inn automatisk. Prøv å logge inn manuelt.' };
					loading = false;
					isLogin = true; // Switch to login mode
					return;
				}

				// Successfully logged in
				goto('/');
			}
		} catch (err) {
			message = { type: 'error', text: 'En uventet feil oppstod' };
			loading = false;
		}
	}

	async function signOut() {
		const supabase = createClient();
		await supabase.auth.signOut();
		goto('/');
	}

	function toggleMode() {
		isLogin = !isLogin;
		message = null;
		password = '';
	}
</script>

{#if session}
	<div class="auth-section">
		<div class="user-info">
			<span class="user-icon">👤</span>
			<span class="user-name">
				{session.user.email || 'Bruker'}
			</span>
		</div>
		<button class="logout-btn" onclick={signOut}>
			<span class="logout-icon">🚪</span>
			Logg ut
		</button>
	</div>
{:else}
	<div class="auth-section">
		<p class="auth-prompt">Logg inn for å lagre fremgangen din</p>
		
		<form 
			class="auth-form" 
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
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
					autocomplete="email"
				/>
			</div>

			<div class="input-group">
				<label for="password-input" class="input-label">Passord</label>
				<input
					id="password-input"
					type="password"
					placeholder="••••••••"
					bind:value={password}
					disabled={loading}
					class="password-input"
					required
					minlength="6"
					autocomplete={isLogin ? "current-password" : "new-password"}
				/>
			</div>
			
			<button 
				type="submit" 
				class="auth-btn" 
				disabled={loading}
			>
				{#if loading}
					<span class="spinner"></span>
					{isLogin ? 'Logger inn...' : 'Oppretter...'}
				{:else}
					<span class="auth-icon">{isLogin ? '🔑' : '✨'}</span>
					{isLogin ? 'Logg inn' : 'Opprett konto'}
				{/if}
			</button>
		</form>

		<button class="toggle-mode-btn" onclick={toggleMode} disabled={loading}>
			{isLogin ? 'Har du ikke konto? Opprett en her' : 'Har du allerede konto? Logg inn her'}
		</button>

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

	.user-name {
		font-weight: 500;
		text-transform: capitalize;
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
		gap: 0.75rem;
	}

	.input-label {
		font-size: 0.9rem;
		color: var(--color-text-dim);
		font-weight: 500;
	}

	.email-input,
	.password-input {
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

	.email-input:hover:not(:disabled),
	.password-input:hover:not(:disabled) {
		border-color: rgba(255, 255, 255, 0.25);
		background: rgba(255, 255, 255, 0.08);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.email-input:focus,
	.password-input:focus {
		outline: none;
		border-color: var(--color-primary);
		background: rgba(255, 255, 255, 0.1);
		box-shadow: 
			0 4px 16px rgba(0, 0, 0, 0.2),
			0 0 0 4px rgba(255, 213, 79, 0.1),
			0 0 20px rgba(255, 213, 79, 0.2);
		transform: translateY(-2px);
	}

	.email-input:disabled,
	.password-input:disabled {
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

	.auth-icon {
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

	.toggle-mode-btn {
		padding: 0.5rem 1rem;
		background: transparent;
		border: none;
		color: var(--color-text-dim);
		font-family: var(--font-body);
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.3s ease;
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.toggle-mode-btn:hover:not(:disabled) {
		color: var(--color-primary);
	}

	.toggle-mode-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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
			gap: 1rem;
		}

		.auth-btn {
			padding: 0.85rem 1.5rem;
			font-size: 0.95rem;
		}

		.email-input,
		.password-input {
			padding: 0.9rem 1.1rem;
			font-size: 0.95rem;
		}

		.user-name {
			font-size: 0.85rem;
		}
	}
</style>

