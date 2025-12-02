<script lang="ts">
	import { createClient } from '$lib/supabase/client';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { LogIn, UserPlus, User, LogOut } from 'lucide-svelte';

	let { session, user } = $props<{ session: any; user: { id: string; email: string | null } | null }>();

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);
	let isLogin = $state(true); // Toggle between login and register
	
	// Use authenticated user data (verified with getUser() on server) instead of session.user
	let authenticatedUser = $derived(user);
	let isAuthenticated = $derived(!!authenticatedUser);

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

{#if isAuthenticated && authenticatedUser}
	<div class="auth-section authenticated">
		<div class="user-info">
			<User class="user-icon" />
			<span class="user-name" title={authenticatedUser.email || 'Bruker'}>
				{authenticatedUser.email || 'Bruker'}
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
		gap: 0.75rem;
		padding: 0.5rem 0.9rem;
		background: linear-gradient(135deg, 
			rgba(35, 42, 61, 0.6) 0%,
			rgba(30, 39, 54, 0.65) 100%
		);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 10px;
		backdrop-filter: blur(12px) saturate(160%);
		animation: slideInDown 0.5s ease-out;
		box-shadow: 
			0 4px 16px rgba(0, 0, 0, 0.2),
			0 0 12px rgba(255, 213, 79, 0.03),
			inset 0 1px 0 rgba(255, 255, 255, 0.06);
		position: relative;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.auth-section.authenticated::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, 
			transparent 0%,
			rgba(255, 213, 79, 0.3) 50%,
			transparent 100%
		);
		opacity: 0.5;
	}

	.auth-section.authenticated:hover {
		border-color: rgba(255, 255, 255, 0.12);
		box-shadow: 
			0 6px 20px rgba(0, 0, 0, 0.25),
			0 0 20px rgba(255, 213, 79, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
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
		color: var(--color-text);
		font-size: 0.8rem;
		opacity: 0.8;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		flex: 1;
		min-width: 0;
	}

	.auth-section.authenticated:hover .user-info {
		opacity: 0.95;
	}

	.user-name {
		font-weight: 500;
		word-break: break-all;
		font-size: 0.8rem;
		letter-spacing: 0.1px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.logout-btn {
		padding: 0.4rem 0.85rem;
		background: linear-gradient(135deg, 
			rgba(239, 68, 68, 0.12) 0%,
			rgba(239, 68, 68, 0.06) 100%
		);
		border: 1px solid rgba(239, 68, 68, 0.25);
		border-radius: 8px;
		color: var(--color-accent-light);
		font-family: var(--font-body);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		opacity: 0.8;
		white-space: nowrap;
		position: relative;
		overflow: hidden;
		box-shadow: 
			0 2px 8px rgba(239, 68, 68, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}

	.logout-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
		transition: left 0.5s ease;
	}

	.logout-btn:hover::before {
		left: 100%;
	}

	.logout-btn:hover {
		background: linear-gradient(135deg, 
			rgba(239, 68, 68, 0.2) 0%,
			rgba(239, 68, 68, 0.1) 100%
		);
		border-color: rgba(239, 68, 68, 0.4);
		opacity: 1;
		color: #fca5a5;
		box-shadow: 
			0 4px 12px rgba(239, 68, 68, 0.15),
			0 0 10px rgba(239, 68, 68, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.logout-btn:active {
		transform: translateY(0);
	}

	.logout-text {
		display: inline;
	}

	.auth-form {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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
		font-size: 0.85rem;
		color: var(--color-text);
		font-weight: 600;
		margin-bottom: 0.25rem;
		letter-spacing: 0.5px;
	}

	.email-input,
	.password-input {
		padding: 0.75rem 1rem;
		background: rgba(255, 255, 255, 0.08);
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-radius: 10px;
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: 0.9rem;
		transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
		width: 100%;
		box-shadow: 
			0 4px 16px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
		font-weight: 500;
		backdrop-filter: blur(10px);
	}

	.email-input:hover:not(:disabled),
	.password-input:hover:not(:disabled) {
		border-color: rgba(255, 255, 255, 0.28);
		background: rgba(255, 255, 255, 0.1);
	}

	.email-input:focus,
	.password-input:focus {
		outline: none;
		border-color: var(--color-primary);
		background: rgba(255, 255, 255, 0.12);
		box-shadow: 
			0 4px 20px rgba(0, 0, 0, 0.25),
			0 0 0 3px rgba(255, 213, 79, 0.15),
			0 0 25px rgba(255, 213, 79, 0.2);
	}

	.email-input:disabled,
	.password-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.auth-btn {
		padding: 0.7rem 1.25rem;
		border: 2px solid rgba(255, 213, 79, 0.4);
		border-radius: 10px;
		background: linear-gradient(135deg, 
			rgba(255, 213, 79, 0.2) 0%,
			rgba(255, 213, 79, 0.12) 50%,
			rgba(255, 213, 79, 0.18) 100%
		);
		background-size: 200% auto;
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		width: 100%;
		position: relative;
		overflow: hidden;
		box-shadow: 
			0 6px 20px rgba(0, 0, 0, 0.25),
			0 0 30px rgba(255, 213, 79, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		animation: buttonShine 4s ease-in-out infinite;
		letter-spacing: 0.3px;
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
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
		transition: left 0.7s ease;
	}

	.auth-btn:hover:not(:disabled)::before {
		left: 100%;
	}

	.auth-btn:hover:not(:disabled) {
		background-position: 100% center;
		border-color: rgba(255, 213, 79, 0.5);
		box-shadow: 
			0 6px 24px rgba(255, 213, 79, 0.3),
			0 0 30px rgba(255, 213, 79, 0.15),
			0 4px 15px rgba(0, 0, 0, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.auth-btn:active:not(:disabled) {
		transform: translateY(-1px) scale(0.99);
	}

	.auth-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
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
		padding: 0.4rem 0.75rem;
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
			gap: 0.75rem;
			width: 100%;
		}

		.auth-section.authenticated {
			padding: 0.35rem 0.6rem;
			gap: 0.5rem;
		}

		.auth-btn {
			padding: 0.6rem 1rem;
			font-size: 0.85rem;
		}

		.input-label {
			font-size: 0.8rem;
		}

		.email-input,
		.password-input {
			padding: 0.65rem 0.9rem;
			font-size: 0.85rem;
		}

		.user-info {
			font-size: 0.7rem;
			gap: 0.3rem;
			flex: 1;
			min-width: 0;
		}

		.user-name {
			font-size: 0.7rem;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.logout-btn {
			padding: 0.15rem 0.25rem;
			font-size: 0;
			gap: 0;
			flex-shrink: 0;
			border-radius: 4px;
		}

		.logout-text {
			display: none;
		}
	}

	@media (max-width: 400px) {
		.auth-section.authenticated {
			padding: 0.3rem 0.5rem;
			gap: 0.35rem;
		}

		.user-info {
			font-size: 0.65rem;
			gap: 0.25rem;
		}

		.user-name {
			font-size: 0.65rem;
			max-width: 120px;
		}

		.logout-btn {
			padding: 0.12rem 0.2rem;
			border-radius: 3px;
		}
	}
</style>

