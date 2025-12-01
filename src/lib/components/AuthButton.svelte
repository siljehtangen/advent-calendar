<script lang="ts">
	import { createClient } from '$lib/supabase/client';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { LogIn, UserPlus, User, LogOut } from 'lucide-svelte';

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

				// Success - use full page reload to ensure session is properly set
				loading = false;
				window.location.href = '/';
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
					loading = false;
					// Use window.location for full page reload to ensure session is properly set
					window.location.href = '/';
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

				// Successfully logged in - use full page reload
				loading = false;
				window.location.href = '/';
			}
		} catch (err) {
			message = { type: 'error', text: 'En uventet feil oppstod' };
			loading = false;
		}
	}

	async function signOut() {
		const supabase = createClient();
		await supabase.auth.signOut();
		// Use full page reload to ensure session is cleared
		window.location.href = '/';
	}

	function toggleMode() {
		isLogin = !isLogin;
		message = null;
		password = '';
	}
</script>

{#if session}
	<div class="auth-section authenticated">
		<div class="user-info">
			<User class="user-icon" />
			<span class="user-name" title={session.user.email || 'Bruker'}>
				{session.user.email || 'Bruker'}
			</span>
		</div>
		<button class="logout-btn" onclick={signOut} aria-label="Logg ut">
			<LogOut class="logout-icon" />
			<span class="logout-text">Logg ut</span>
		</button>
	</div>
{:else}
	<div class="auth-section">
		
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
					{#if isLogin}
						<LogIn class="auth-icon" />
					{:else}
						<UserPlus class="auth-icon" />
					{/if}
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
		animation: fadeInUp 0.6s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.auth-section.authenticated {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 10px;
		backdrop-filter: blur(10px);
		animation: slideInDown 0.5s ease-out;
	}

	@keyframes slideInDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-text-dim);
		font-size: 0.85rem;
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}

	.auth-section.authenticated:hover .user-info {
		opacity: 0.9;
	}

	.user-icon {
		width: 1rem;
		height: 1rem;
		opacity: 0.6;
		transition: transform 0.3s ease, opacity 0.3s ease;
		color: var(--color-text-dim);
	}

	.auth-section.authenticated:hover .user-icon {
		opacity: 0.8;
		transform: scale(1.1);
	}

	.user-name {
		font-weight: 400;
		word-break: break-all;
		font-size: 0.85rem;
	}

	.logout-btn {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: var(--color-text-dim);
		font-family: var(--font-body);
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		opacity: 0.7;
		white-space: nowrap;
		position: relative;
		overflow: hidden;
	}

	.logout-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
		transition: left 0.5s ease;
	}

	.logout-btn:hover::before {
		left: 100%;
	}

	.logout-btn:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.25);
		opacity: 1;
		color: var(--color-text);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.logout-btn:active {
		transform: translateY(0);
	}

	.logout-icon {
		width: 1rem;
		height: 1rem;
		transition: transform 0.3s ease;
		color: var(--color-text-dim);
	}

	.logout-btn:hover .logout-icon {
		transform: translateX(2px) rotate(-15deg);
	}

	.logout-text {
		display: inline;
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
		animation: fadeInUp 0.6s ease-out;
		animation-fill-mode: both;
	}

	.input-group:nth-child(1) {
		animation-delay: 0.1s;
	}

	.input-group:nth-child(2) {
		animation-delay: 0.2s;
	}

	.input-label {
		font-size: 1rem;
		color: var(--color-text);
		font-weight: 600;
		margin-bottom: 0.5rem;
		letter-spacing: 0.5px;
	}

	.email-input,
	.password-input {
		padding: 0.9rem 1.25rem;
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.25);
		border-radius: 12px;
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: 1.05rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		width: 100%;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		font-weight: 500;
	}

	.email-input:hover:not(:disabled),
	.password-input:hover:not(:disabled) {
		border-color: rgba(255, 255, 255, 0.4);
		background: rgba(255, 255, 255, 0.15);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
	}

	.email-input:focus,
	.password-input:focus {
		outline: none;
		border-color: var(--color-primary);
		background: rgba(255, 255, 255, 0.18);
		box-shadow: 
			0 8px 24px rgba(0, 0, 0, 0.3),
			0 0 0 4px rgba(255, 213, 79, 0.15),
			0 0 30px rgba(255, 213, 79, 0.3);
		transform: translateY(-3px);
	}

	.email-input:disabled,
	.password-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.auth-btn {
		padding: 0.85rem 1.5rem;
		border: 2px solid rgba(255, 213, 79, 0.3);
		border-radius: 12px;
		background: linear-gradient(135deg, 
			rgba(255, 213, 79, 0.15) 0%,
			rgba(255, 213, 79, 0.1) 100%
		);
		background-size: 200% auto;
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
		animation: buttonShine 3s ease-in-out infinite;
	}

	@keyframes buttonShine {
		0%, 100% { background-position: 0% center; }
		50% { background-position: 100% center; }
	}

	.auth-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.6s ease;
	}

	.auth-btn:hover:not(:disabled)::before {
		left: 100%;
	}

	.auth-btn:hover:not(:disabled) {
		background-position: 100% center;
		border-color: rgba(255, 213, 79, 0.5);
		transform: translateY(-3px) scale(1.02);
		box-shadow: 
			0 8px 25px rgba(255, 213, 79, 0.5),
			0 4px 15px rgba(0, 0, 0, 0.3);
	}

	.auth-btn:active:not(:disabled) {
		transform: translateY(-1px) scale(0.98);
	}

	.auth-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.auth-icon {
		width: 1.1rem;
		height: 1.1rem;
		color: var(--color-text);
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

		.auth-section.authenticated {
			padding: 0.65rem 0.85rem;
			gap: 0.75rem;
		}

		.auth-btn {
			padding: 0.75rem 1.25rem;
			font-size: 0.9rem;
		}

		.input-label {
			font-size: 1rem;
		}

		.email-input,
		.password-input {
			padding: 0.85rem 1.1rem;
			font-size: 1rem;
		}

		.user-info {
			font-size: 0.8rem;
			gap: 0.4rem;
			flex: 1;
			min-width: 0;
		}

		.user-icon {
			width: 0.9rem;
			height: 0.9rem;
			flex-shrink: 0;
		}

		.user-name {
			font-size: 0.8rem;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.logout-btn {
			padding: 0.45rem 0.85rem;
			font-size: 0.75rem;
			gap: 0.35rem;
			flex-shrink: 0;
		}

		.logout-icon {
			width: 0.85rem;
			height: 0.85rem;
		}
	}

	@media (max-width: 400px) {
		.auth-section.authenticated {
			padding: 0.55rem 0.75rem;
			gap: 0.5rem;
		}

		.user-info {
			font-size: 0.75rem;
			gap: 0.35rem;
		}

		.user-icon {
			width: 0.85rem;
			height: 0.85rem;
		}

		.user-name {
			font-size: 0.75rem;
			max-width: 120px;
		}

		.logout-btn {
			padding: 0.4rem 0.7rem;
			font-size: 0.7rem;
			gap: 0.3rem;
		}

		.logout-text {
			display: none;
		}

		.logout-icon {
			width: 0.85rem;
			height: 0.85rem;
		}
	}
</style>

