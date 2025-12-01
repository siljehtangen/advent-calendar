<script lang="ts">
	import Door from '$lib/components/Door.svelte';
	import StoryModal from '$lib/components/StoryModal.svelte';
	import CalendarHeader from '$lib/components/CalendarHeader.svelte';
	import AuthButton from '$lib/components/AuthButton.svelte';
	import { page } from '$app/stores';
	import { openedDoors, quizAnswers } from '$lib/stores';
	import { browser } from '$app/environment';

	const shuffledPositions = [
		24, 7, 15, 3, 19, 11,
		1, 22, 9, 16, 4, 20,
		13, 6, 18, 2, 23, 10,
		8, 14, 21, 5, 17, 12
	];

	let session = $derived($page.data.session);
	let isAuthenticated = $derived(!!session);
	let errorMessage = $derived($page.url.searchParams.get('error'));
	
	// Initialize stores with user data when authenticated
	$effect(() => {
		if (browser && session?.user?.id) {
			openedDoors.initialize(session.user.id);
			quizAnswers.initialize(session.user.id);
		} else if (browser) {
			openedDoors.initialize(null);
			quizAnswers.initialize(null);
		}
	});
</script>

<svelte:head>
	<title>Julekalender 2025</title>
	<meta name="description" content="Åpne en luke hver dag og følg mysteriet." />
</svelte:head>

<main class="main">
	{#if !isAuthenticated}
		<div class="login-required">
			<div class="login-lights">
				{#each Array(16) as _, i}
					<span class="login-light" style="--delay: {i * 0.1}s; --color: {['#ef4444', '#22c55e', '#ffd54f', '#3b82f6', '#ec4899'][i % 5]}"></span>
				{/each}
			</div>

			<div class="login-content">
				<div class="login-header">
					<p class="login-year">
						Julekalender 2025
					</p>
					<h1 class="login-tagline">En fiktiv mysterie-fortelling hvor du velger hva som skal skje!</h1>
				</div>

				<div class="login-divider">
					<span class="divider-sparkle">✦</span>
					<div class="divider-line"></div>
					<span class="divider-sparkle">✦</span>
				</div>

				<p class="login-description">
					For å åpne julekalenderen må du logge inn med e-post og passord
				</p>

				{#if errorMessage}
					<div class="error-banner">
						<p class="error-banner-text">
							⚠️ {decodeURIComponent(errorMessage)}
						</p>
					</div>
				{/if}

				<div class="login-form-wrapper">
					<AuthButton {session} />
				</div>

				<div class="attribution">
					<p class="attribution-text">
						Laget av <a href="https://siljehtangen.vercel.app" target="_blank" rel="noopener noreferrer" class="attribution-link">Silje H. Tangen</a>
					</p>
				</div>
			</div>
		</div>
	{:else}
		<CalendarHeader />
		
		<div class="user-auth-section">
			<AuthButton {session} />
		</div>

		<section class="calendar-section">
		<div class="calendar-grid">
			<div class="grid-glow"></div>
			
			{#each shuffledPositions as day, index}
				<div class="door-wrapper" style="--delay: {index * 0.04}s; --index: {index}">
					<Door {day} />
				</div>
			{/each}
		</div>
		</section>

		<div class="attribution">
			<p class="attribution-text">
				Laget av <a href="https://siljehtangen.vercel.app" target="_blank" rel="noopener noreferrer" class="attribution-link">Silje H. Tangen</a>
			</p>
		</div>
	{/if}
</main>

{#if isAuthenticated}
	<StoryModal />
{/if}

<style>
	.main {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 100vw;
	}

	.calendar-section {
		flex: 1;
		padding: 2.5rem 0 3.5rem;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		position: relative;
		width: 100%;
		max-width: 100vw;
		box-sizing: border-box;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(6, 80px);
		justify-content: center;
		justify-items: center;
		align-items: center;
		gap: 1.5rem;
		padding: 2.5rem;
		margin: 0 auto;
		place-self: center;
		background: linear-gradient(165deg, 
			rgba(34, 197, 94, 0.15) 0%,
			rgba(35, 42, 61, 0.98) 20%,
			rgba(45, 54, 77, 0.95) 50%,
			rgba(35, 42, 61, 0.98) 80%,
			rgba(239, 68, 68, 0.12) 100%
		);
		border: 2px solid rgba(255, 213, 79, 0.25);
		border-radius: 32px;
		box-shadow: 
			0 30px 80px rgba(0, 0, 0, 0.4),
			0 0 60px rgba(34, 197, 94, 0.1),
			0 0 80px rgba(239, 68, 68, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2);
		position: relative;
		overflow: visible;
		box-sizing: border-box;
	}

	.calendar-grid::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 32px;
		background: 
			radial-gradient(circle at 10% 5%, rgba(34, 197, 94, 0.25) 0%, transparent 35%),
			radial-gradient(circle at 90% 95%, rgba(239, 68, 68, 0.2) 0%, transparent 35%),
			radial-gradient(circle at 50% 50%, rgba(255, 213, 79, 0.08) 0%, transparent 50%),
			radial-gradient(circle at 85% 15%, rgba(239, 68, 68, 0.15) 0%, transparent 30%),
			radial-gradient(circle at 15% 85%, rgba(34, 197, 94, 0.15) 0%, transparent 30%);
		pointer-events: none;
		animation: ambientPulse 8s ease-in-out infinite alternate;
	}

	@keyframes ambientPulse {
		0% { opacity: 1; }
		100% { opacity: 0.7; }
	}

	.grid-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 70%;
		height: 70%;
		background: radial-gradient(ellipse, rgba(255, 213, 79, 0.08) 0%, transparent 60%);
		pointer-events: none;
		animation: gridGlow 8s ease-in-out infinite alternate;
	}

	@keyframes gridGlow {
		0% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
		100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.05); }
	}

	.door-wrapper {
		width: 100%;
		animation: doorAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		animation-delay: var(--delay);
		opacity: 0;
		position: relative;
		z-index: 1;
	}

	.door-wrapper:hover {
		z-index: 100;
	}

	@keyframes doorAppear {
		0% {
			opacity: 0;
			transform: translateY(30px) scale(0.8) rotateX(20deg);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1) rotateX(0deg);
		}
	}

	@media (max-width: 700px) {
		.calendar-section {
			padding: 1.5rem 0.5rem 2rem;
		}

		.calendar-grid {
			grid-template-columns: repeat(4, 70px);
			gap: 1rem;
			padding: 1.5rem;
			border-radius: 24px;
		}

	}

	@media (max-width: 500px) {
		.calendar-section {
			padding: 1rem 0.25rem 1.5rem;
		}

		.calendar-grid {
			grid-template-columns: repeat(4, 60px);
			gap: 0.7rem;
			padding: 1rem;
			border-radius: 18px;
			border-width: 1.5px;
		}

	}

	@media (max-width: 380px) {
		.calendar-grid {
			grid-template-columns: repeat(3, 65px);
			gap: 0.6rem;
			padding: 0.85rem;
		}
	}

	.user-auth-section {
		width: 100%;
		max-width: 800px;
		margin: 1rem auto 0;
		padding: 0 1rem;
		display: flex;
		justify-content: center;
	}

	@media (max-width: 600px) {
		.user-auth-section {
			margin: 0.75rem auto 0;
			padding: 0 0.75rem;
		}
	}

	@media (max-width: 400px) {
		.user-auth-section {
			margin: 0.5rem auto 0;
			padding: 0 0.5rem;
		}
	}

	/* Login Screen Styles */
	.login-required {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.5rem;
		position: relative;
		overflow: hidden;
	}

	.login-lights {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 12%;
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		padding-top: 2%;
		pointer-events: none;
		z-index: 0;
	}

	.login-light {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--color);
		box-shadow: 0 0 10px var(--color), 0 0 20px var(--color);
		animation: twinkle 2s ease-in-out infinite;
		animation-delay: var(--delay);
		opacity: 0.4;
	}

	@keyframes twinkle {
		0%, 100% { opacity: 0.4; transform: scale(1); }
		50% { opacity: 1; transform: scale(1.3); }
	}

	.login-content {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 480px;
		text-align: center;
		animation: fadeIn 1s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.login-header {
		margin-bottom: 1.5rem;
		animation: fadeIn 1s ease-out 0.2s both;
	}

	.login-year {
		font-family: var(--font-display);
		font-size: 2.25rem;
		color: var(--color-text);
		margin: 0 0 0.75rem 0;
		letter-spacing: 3px;
		text-transform: uppercase;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		font-weight: 700;
		text-shadow: 0 0 20px rgba(255, 213, 79, 0.3);
		background: linear-gradient(135deg, 
			var(--color-text) 0%, 
			var(--color-primary) 50%,
			var(--color-text) 100%
		);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: titleShine 3s ease-in-out infinite;
	}

	@keyframes titleShine {
		0%, 100% { background-position: 0% center; }
		50% { background-position: 100% center; }
	}

	.subtitle-icon {
		font-size: 0.7rem;
		color: var(--color-primary);
		animation: twinkle 2s ease-in-out infinite;
	}

	.subtitle-icon:last-child {
		animation-delay: 1s;
	}

	.login-tagline {
		font-family: var(--font-body);
		font-size: 1rem;
		color: var(--color-text-dim);
		margin: 0;
		opacity: 0.8;
		line-height: 1.5;
	}

	.login-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin: 1.5rem 0;
		animation: fadeIn 1s ease-out 0.4s both;
	}

	.divider-line {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, 
			transparent 0%,
			rgba(255, 255, 255, 0.2) 50%,
			transparent 100%
		);
	}

	.divider-sparkle {
		font-size: 1rem;
		display: inline-block;
		color: var(--color-primary);
		animation: sparkleGlow 2.5s ease-in-out infinite;
		filter: drop-shadow(0 0 6px rgba(255, 213, 79, 0.9));
	}

	.divider-sparkle:last-child {
		animation-delay: 1.25s;
	}

	@keyframes sparkleGlow {
		0%, 100% { 
			opacity: 0.4; 
			transform: scale(1) rotate(0deg); 
			filter: drop-shadow(0 0 4px rgba(255, 213, 79, 0.6));
		}
		50% { 
			opacity: 1; 
			transform: scale(1.4) rotate(180deg);
			filter: drop-shadow(0 0 16px rgba(255, 213, 79, 1));
		}
	}

	.login-description {
		font-family: var(--font-body);
		font-size: 1.15rem;
		line-height: 1.8;
		margin: 0 0 1.5rem 0;
		animation: fadeIn 1s ease-out 0.6s both;
		background: linear-gradient(90deg, 
			#ef4444 0%, 
			#dc2626 20%,
			#22c55e 40%,
			#16a34a 60%,
			#ef4444 80%,
			#22c55e 100%
		);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: fadeIn 1s ease-out 0.6s both, gradientShift 4s ease-in-out infinite;
	}

	.login-form-wrapper {
		animation: fadeInUp 0.8s ease-out 0.4s both;
	}

	@keyframes gradientShift {
		0%, 100% { background-position: 0% center; }
		50% { background-position: 100% center; }
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.error-banner {
		width: 100%;
		padding: 1.25rem 1.5rem;
		background: linear-gradient(135deg, 
			rgba(239, 68, 68, 0.15) 0%,
			rgba(239, 68, 68, 0.1) 100%
		);
		border: 2px solid rgba(239, 68, 68, 0.4);
		border-radius: 12px;
		margin-bottom: 1.5rem;
		animation: fadeIn 0.5s ease-out;
	}

	.error-banner-text {
		color: #fca5a5;
		font-size: 1rem;
		font-weight: 500;
		margin: 0;
		line-height: 1.5;
	}

	.attribution {
		text-align: center;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.15);
		animation: fadeIn 1s ease-out 1s both;
	}

	.attribution-text {
		font-family: var(--font-body);
		font-size: 1rem;
		color: var(--color-text);
		margin: 0;
		opacity: 0.9;
		font-weight: 500;
	}

	.attribution-link {
		color: var(--color-primary);
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		position: relative;
		text-shadow: 0 0 10px rgba(255, 213, 79, 0.3);
	}

	.attribution-link::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 1px;
		background: var(--color-primary);
		transition: width 0.3s ease;
	}

	.attribution-link:hover {
		color: var(--color-primary-glow);
		opacity: 1;
		text-shadow: 0 0 15px rgba(255, 213, 79, 0.6);
		transform: scale(1.05);
	}

	.attribution-link:hover::after {
		width: 100%;
	}

	.main:has(.calendar-section) .attribution {
		margin-top: 2rem;
		padding: 1.5rem 1rem 1rem;
	}

	@media (max-width: 600px) {
		.login-required {
			padding: 1.5rem 1rem;
		}

		.login-tagline {
			font-size: 1.5rem;
		}

		.login-description {
			font-size: 1.05rem;
			margin-bottom: 2rem;
		}

		.attribution {
			margin-top: 1rem;
			padding-top: 0.75rem;
		}

		.attribution-text {
			font-size: 0.95rem;
		}

		.main:has(.calendar-section) .attribution {
			margin-top: 1.5rem;
			padding: 1.25rem 1rem 0.75rem;
		}
	}

	@media (max-width: 400px) {
		.login-lights {
			height: 10%;
		}

		.login-light {
			opacity: 0.3;
		}

		.login-header {
			margin-bottom: 1rem;
		}

		.login-divider {
			margin: 1rem 0;
		}

		.login-tagline {
			font-size: 1.3rem;
		}

		.login-description {
			font-size: 1rem;
			margin-bottom: 1rem;
		}

		.attribution {
			margin-top: 0.75rem;
			padding-top: 0.5rem;
		}

		.attribution-text {
			font-size: 0.9rem;
		}

		.main:has(.calendar-section) .attribution {
			margin-top: 1.25rem;
			padding: 1rem 0.75rem 0.5rem;
		}
	}
</style>
