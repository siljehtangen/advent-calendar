<script lang="ts">
	import Door from '$lib/components/Door.svelte';
	import StoryModal from '$lib/components/StoryModal.svelte';
	import CalendarHeader from '$lib/components/CalendarHeader.svelte';
	import AuthButton from '$lib/components/AuthButton.svelte';
	import { page } from '$app/stores';

	const shuffledPositions = [
		24, 7, 15, 3, 19, 11,
		1, 22, 9, 16, 4, 20,
		13, 6, 18, 2, 23, 10,
		8, 14, 21, 5, 17, 12
	];

	let session = $derived($page.data.session);
	let isAuthenticated = $derived(!!session);
</script>

<svelte:head>
	<title>Bak julelysene – Julekalender 2025</title>
	<meta name="description" content="Åpne en luke hver dag og følg mysteriet." />
</svelte:head>

<main class="main">
	{#if !isAuthenticated}
		<div class="login-required">
			<div class="login-bg-decorations">
				<div class="deco-snowflake deco-1">❄</div>
				<div class="deco-snowflake deco-2">✦</div>
				<div class="deco-snowflake deco-3">★</div>
				<div class="deco-snowflake deco-4">❅</div>
				<div class="deco-snowflake deco-5">✧</div>
				<div class="deco-snowflake deco-6">❆</div>
			</div>
			
			<div class="login-lights">
				{#each Array(16) as _, i}
					<span class="login-light" style="--delay: {i * 0.1}s; --color: {['#ef4444', '#22c55e', '#ffd54f', '#3b82f6', '#ec4899'][i % 5]}"></span>
				{/each}
			</div>

			<div class="login-content">
				<div class="login-header">
					<p class="login-year">Julekalender 2025</p>
					<h1 class="login-title">Bak julelysene</h1>
					<p class="login-tagline">En mysterie-fortelling på 24 luker</p>
				</div>

				<div class="login-divider">
					<span class="divider-sparkle">✦</span>
					<div class="divider-line"></div>
					<span class="divider-sparkle">✦</span>
				</div>

				<p class="login-description">
					For å åpne julekalenderen din, må du  skrive inn e-postadressen din så sender vi deg en unik magisk lenke som tar deg til den
				</p>

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

		<section class="calendar-section">
		<div class="corner-deco corner-tl">❄</div>
		<div class="corner-deco corner-tr">✦</div>
		<div class="corner-deco corner-bl">★</div>
		<div class="corner-deco corner-br">❅</div>
		
		<div class="calendar-grid">
			<div class="grid-glow"></div>
			<div class="winter-icons">
				<span class="winter-icon" style="top: 18%; left: 25%;">❄</span>
				<span class="winter-icon" style="top: 35%; left: 58%;">✦</span>
				<span class="winter-icon" style="top: 52%; left: 15%;">❅</span>
				<span class="winter-icon" style="top: 28%; left: 82%;">★</span>
				<span class="winter-icon" style="top: 68%; left: 42%;">✧</span>
				<span class="winter-icon" style="top: 45%; left: 75%;">❆</span>
				<span class="winter-icon" style="top: 78%; left: 22%;">✦</span>
				<span class="winter-icon" style="top: 62%; left: 88%;">❄</span>
				<span class="winter-icon" style="top: 85%; left: 65%;">★</span>
			</div>
			
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

	.corner-deco {
		position: absolute;
		font-size: 2rem;
		opacity: 0.08;
		animation: floatCorner 10s ease-in-out infinite;
		pointer-events: none;
	}

	.corner-tl { top: 1rem; left: 1rem; color: var(--color-frost); }
	.corner-tr { top: 1rem; right: 1rem; color: var(--color-primary); animation-delay: 1s; }
	.corner-bl { bottom: 1rem; left: 1rem; color: var(--color-accent-light); animation-delay: 2s; }
	.corner-br { bottom: 1rem; right: 1rem; color: var(--color-green-light); animation-delay: 1.5s; }

	@keyframes floatCorner {
		0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.08; }
		50% { transform: translateY(-5px) rotate(5deg); opacity: 0.15; }
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

	.winter-icons {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.winter-icon {
		position: absolute;
		font-size: 0.9rem;
		opacity: 0.1;
		color: var(--color-frost);
		animation: floatIcon 12s ease-in-out infinite;
	}

	.winter-icon:nth-child(1) { animation-delay: 0s; color: var(--color-frost); }
	.winter-icon:nth-child(2) { animation-delay: 2s; color: var(--color-primary); font-size: 0.7rem; }
	.winter-icon:nth-child(3) { animation-delay: 4s; color: var(--color-frost); }
	.winter-icon:nth-child(4) { animation-delay: 1s; color: var(--color-accent-light); font-size: 0.8rem; }
	.winter-icon:nth-child(5) { animation-delay: 6s; color: var(--color-primary); font-size: 0.6rem; }
	.winter-icon:nth-child(6) { animation-delay: 5s; color: var(--color-frost); }
	.winter-icon:nth-child(7) { animation-delay: 1.5s; color: var(--color-green-light); font-size: 0.7rem; }
	.winter-icon:nth-child(8) { animation-delay: 3s; color: var(--color-frost); font-size: 0.8rem; }
	.winter-icon:nth-child(9) { animation-delay: 7s; color: var(--color-accent-light); font-size: 0.65rem; }

	@keyframes floatIcon {
		0%, 100% { 
			transform: translateY(0) rotate(0deg); 
			opacity: 0.08;
		}
		50% { 
			transform: translateY(-4px) rotate(5deg); 
			opacity: 0.15;
		}
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

		.corner-deco {
			font-size: 1.5rem;
		}

		.winter-icon {
			font-size: 0.7rem;
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

		.corner-deco {
			display: none;
		}

		.winter-icons {
			display: none;
		}
	}

	@media (max-width: 380px) {
		.calendar-grid {
			grid-template-columns: repeat(3, 65px);
			gap: 0.6rem;
			padding: 0.85rem;
		}
	}

	.login-required {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		position: relative;
		overflow: hidden;
	}

	.login-bg-decorations {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
		z-index: 0;
	}

	.deco-snowflake {
		position: absolute;
		font-size: 1.5rem;
		opacity: 0.15;
		color: var(--color-frost);
		animation: floatDeco 15s ease-in-out infinite;
	}

	.deco-1 { top: 10%; left: 10%; animation-delay: 0s; }
	.deco-2 { top: 20%; right: 15%; animation-delay: 2s; font-size: 1.2rem; }
	.deco-3 { top: 60%; left: 8%; animation-delay: 4s; }
	.deco-4 { top: 40%; right: 10%; animation-delay: 6s; font-size: 1.3rem; }
	.deco-5 { top: 70%; right: 20%; animation-delay: 1s; }
	.deco-6 { top: 30%; left: 25%; animation-delay: 3s; font-size: 1.1rem; }

	@keyframes floatDeco {
		0%, 100% { 
			transform: translateY(0) rotate(0deg) scale(1); 
			opacity: 0.1; 
		}
		50% { 
			transform: translateY(-20px) rotate(180deg) scale(1.2); 
			opacity: 0.2; 
		}
	}

	.login-lights {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		padding: 1rem;
		z-index: 1;
	}

	.login-light {
		width: 10px;
		height: 16px;
		background: var(--color);
		border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
		position: relative;
		box-shadow: 
			0 0 8px var(--color),
			0 0 16px var(--color),
			0 0 24px color-mix(in srgb, var(--color) 50%, transparent);
		animation: twinkleLight 1.5s ease-in-out infinite;
		animation-delay: var(--delay);
	}

	.login-light::before {
		content: '';
		position: absolute;
		top: -3px;
		left: 50%;
		transform: translateX(-50%);
		width: 5px;
		height: 5px;
		background: #374151;
		border-radius: 2px;
	}

	.login-light::after {
		content: '';
		position: absolute;
		top: -6px;
		left: 50%;
		width: 1.5rem;
		height: 6px;
		border-bottom: 2px solid #374151;
		border-radius: 0 0 50% 50%;
		transform: translateX(-50%);
	}

	@keyframes twinkleLight {
		0%, 100% { 
			opacity: 1;
			filter: brightness(1);
		}
		50% { 
			opacity: 0.5;
			filter: brightness(0.6);
		}
	}

	.login-content {
		max-width: 600px;
		width: 100%;
		text-align: center;
		padding: 4rem 3rem;
		background: linear-gradient(165deg, 
			rgba(34, 197, 94, 0.08) 0%,
			rgba(45, 54, 77, 0.98) 20%,
			rgba(35, 42, 61, 0.98) 50%,
			rgba(45, 54, 77, 0.98) 80%,
			rgba(239, 68, 68, 0.08) 100%
		);
		border: 2px solid rgba(255, 213, 79, 0.3);
		border-radius: 32px;
		box-shadow: 
			0 30px 80px rgba(0, 0, 0, 0.5),
			0 0 60px rgba(34, 197, 94, 0.15),
			0 0 80px rgba(239, 68, 68, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		position: relative;
		z-index: 1;
		animation: loginAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
		overflow: hidden;
	}

	.login-content::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 32px;
		background: 
			radial-gradient(circle at 10% 5%, rgba(34, 197, 94, 0.2) 0%, transparent 35%),
			radial-gradient(circle at 90% 95%, rgba(239, 68, 68, 0.15) 0%, transparent 35%),
			radial-gradient(circle at 50% 50%, rgba(255, 213, 79, 0.1) 0%, transparent 50%);
		pointer-events: none;
		animation: ambientPulse 8s ease-in-out infinite alternate;
	}

	@keyframes loginAppear {
		0% {
			opacity: 0;
			transform: translateY(30px) scale(0.95);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes ambientPulse {
		0% { opacity: 1; }
		100% { opacity: 0.7; }
	}

	.login-header {
		margin-bottom: 2.5rem;
		animation: fadeInDown 0.8s ease-out 0.2s both;
	}

	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.login-year {
		font-family: var(--font-body);
		font-size: 1.3rem;
		font-style: italic;
		color: var(--color-text-dim);
		margin: 0 0 1rem 0;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.9;
		animation: shimmer 3s ease-in-out infinite;
	}

	@keyframes shimmer {
		0%, 100% { opacity: 0.7; }
		50% { opacity: 1; }
	}

	.login-title {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 5vw, 2.5rem);
		font-weight: 700;
		margin: 0 0 1rem 0;
		background: linear-gradient(135deg, 
			var(--color-primary) 0%, 
			var(--color-primary-glow) 50%, 
			var(--color-primary) 100%
		);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: textShine 4s linear infinite;
		filter: drop-shadow(0 0 30px rgba(240, 193, 75, 0.4));
		line-height: 1.2;
	}

	@keyframes textShine {
		0% { background-position: 0% center; }
		100% { background-position: 200% center; }
	}

	.login-tagline {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 500;
		color: var(--color-text-dim);
		margin: 0;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.8;
	}

	.login-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin: 2rem 0;
		animation: fadeIn 1s ease-out 0.4s both;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.divider-line {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, 
			transparent 0%,
			rgba(255, 213, 79, 0.4) 50%,
			transparent 100%
		);
	}

	.divider-sparkle {
		font-size: 0.8rem;
		color: var(--color-primary);
		animation: sparkle 2s ease-in-out infinite;
	}

	.divider-sparkle:last-child {
		animation-delay: 1s;
	}

	@keyframes sparkle {
		0%, 100% { 
			opacity: 0.4; 
			transform: scale(1) rotate(0deg); 
		}
		50% { 
			opacity: 1; 
			transform: scale(1.3) rotate(180deg); 
		}
	}

	.login-description {
		font-family: var(--font-body);
		font-size: 1.15rem;
		color: var(--color-text-dim);
		line-height: 1.8;
		margin: 0 0 2.5rem 0;
		animation: fadeIn 1s ease-out 0.6s both;
	}

	.login-form-wrapper {
		animation: fadeInUp 1s ease-out 0.8s both;
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

	@media (max-width: 600px) {
		.login-required {
			padding: 1.5rem 1rem;
		}

		.login-lights {
			gap: 1rem;
			padding: 0.75rem;
		}

		.login-light {
			width: 8px;
			height: 12px;
		}

		.login-content {
			padding: 3rem 2rem;
			border-radius: 24px;
		}

		.login-year {
			font-size: 1.1rem;
		}

		.login-title {
			font-size: clamp(1.5rem, 6vw, 2.2rem);
		}

		.login-tagline {
			font-size: 0.95rem;
		}

		.login-description {
			font-size: 1.05rem;
			margin-bottom: 2rem;
		}

		.deco-snowflake {
			font-size: 1.2rem;
		}
	}

	@media (max-width: 400px) {
		.login-content {
			padding: 2.5rem 1.5rem;
		}

		.login-year {
			font-size: 1rem;
		}

		.login-title {
			font-size: clamp(1.3rem, 5vw, 2rem);
		}

		.login-tagline {
			font-size: 0.85rem;
		}

		.login-description {
			font-size: 1rem;
		}
	}

	.attribution {
		text-align: center;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		animation: fadeIn 1s ease-out 1s both;
	}

	.attribution-text {
		font-family: var(--font-body);
		font-size: 0.75rem;
		color: var(--color-text-muted);
		margin: 0;
		opacity: 0.6;
	}

	.attribution-link {
		color: var(--color-primary);
		text-decoration: none;
		font-weight: 500;
		transition: all 0.3s ease;
		position: relative;
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
	}

	.attribution-link:hover::after {
		width: 100%;
	}

	/* Attribution for authenticated users */
	.main:has(.calendar-section) .attribution {
		margin-top: 2rem;
		padding: 1.5rem 1rem 1rem;
	}

	@media (max-width: 600px) {
		.attribution {
			margin-top: 1rem;
			padding-top: 0.75rem;
		}

		.attribution-text {
			font-size: 0.7rem;
		}

		.main:has(.calendar-section) .attribution {
			margin-top: 1.5rem;
			padding: 1rem 0.75rem 0.75rem;
		}
	}

	@media (max-width: 400px) {
		.attribution {
			margin-top: 0.75rem;
			padding-top: 0.5rem;
		}

		.attribution-text {
			font-size: 0.65rem;
		}

		.main:has(.calendar-section) .attribution {
			margin-top: 1rem;
			padding: 0.75rem 0.5rem 0.5rem;
		}
	}
</style>
