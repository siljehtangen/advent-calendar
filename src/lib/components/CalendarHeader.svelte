<script lang="ts">
	import { openedDoors, quizAnswers, currentTime, getNextAvailableDoor, getTimeUntilUnlock, getCurrentDate } from '$lib/stores';

	let progress = $derived(($openedDoors.length / 24) * 100);
	
	let availableDoorsCount = $derived.by(() => {
		$currentTime;
		const now = getCurrentDate();
		const currentMonth = now.getMonth();
		const currentDay = now.getDate();
		if (currentMonth !== 11) return 0;
		return Math.min(currentDay, 24);
	});
	
	let nextDoor = $derived.by(() => {
		$currentTime;
		return getNextAvailableDoor();
	});
	
	let countdown = $derived.by(() => {
		if (nextDoor === null) return null;
		$currentTime;
		return getTimeUntilUnlock(nextDoor);
	});

	function resetCalendar() {
		if (confirm('Er du sikker på at du vil starte på nytt? Alle åpnede luker og svar vil bli slettet.')) {
			openedDoors.reset();
			quizAnswers.reset();
		}
	}
	
	function formatCountdown(cd: { days: number; hours: number; minutes: number; seconds: number }): string {
		if (cd.days > 0) {
			return `${cd.days} dag${cd.days > 1 ? 'er' : ''}, ${cd.hours} time${cd.hours !== 1 ? 'r' : ''}`;
		}
		if (cd.hours > 0) {
			return `${cd.hours} time${cd.hours !== 1 ? 'r' : ''}, ${cd.minutes} minutt${cd.minutes !== 1 ? 'er' : ''}`;
		}
		if (cd.minutes > 0) {
			return `${cd.minutes} minutt${cd.minutes !== 1 ? 'er' : ''}, ${cd.seconds} sekund${cd.seconds !== 1 ? 'er' : ''}`;
		}
		return `${cd.seconds} sekund${cd.seconds !== 1 ? 'er' : ''}`;
	}
</script>

<header class="header">
	<div class="christmas-lights">
		{#each Array(12) as _, i}
			<span class="light" style="--delay: {i * 0.15}s; --color: {['#ef4444', '#22c55e', '#ffd54f', '#3b82f6', '#ec4899'][i % 5]}"></span>
		{/each}
	</div>
	
	<div class="header-decorations">
		<span class="deco deco-1">❄</span>
		<span class="deco deco-2">✦</span>
		<span class="deco deco-3">★</span>
		<span class="deco deco-4">❅</span>
		<span class="deco deco-5">✧</span>
	</div>
	
	<div class="header-content">
		<div class="title-section">
			<p class="subtitle">
				<span class="subtitle-icon">✦</span>
				Julekalender 2025
				<span class="subtitle-icon">✦</span>
			</p>
			<h1 class="title">
				<span class="title-text">Bak julelysene</span>
			</h1>
			<p class="tagline">En mysterie-fortelling på 24 luker</p>
			<p class="disclaimer">En fiktiv historie satt på spissen – men kanskje den gir deg noe å tenke på?</p>
		</div>

		{#if nextDoor !== null && countdown}
			<div class="countdown-section">
				<div class="countdown-glow"></div>
				<div class="countdown-inner">
					<div class="countdown-label">
						<span class="countdown-icon">🎁</span>
						Neste luke ({nextDoor}. desember) åpner om:
					</div>
					<div class="countdown-timer">
						<span class="timer-value">{formatCountdown(countdown)}</span>
					</div>
				</div>
			</div>
		{/if}

		<div class="progress-section">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progress}%">
					<div class="progress-shine"></div>
				</div>
				{#if progress > 0}
					<div class="progress-glow" style="left: {progress}%"></div>
				{/if}
			</div>
			<p class="progress-text">
				<span class="progress-count">{$openedDoors.length}</span> av <span class="progress-total">{availableDoorsCount}</span> tilgjengelige luker åpnet
				{#if availableDoorsCount < 24}
					<span class="progress-hint">({24 - availableDoorsCount} luker gjenstår i adventstiden)</span>
				{/if}
			</p>
		</div>

		{#if $openedDoors.length > 0}
			<button class="reset-btn" onclick={resetCalendar}>
				<span class="reset-icon">↺</span>
				Start på nytt
			</button>
		{/if}
	</div>
</header>

<style>
	.header {
		padding: 3.5rem 1rem 2.5rem;
		text-align: center;
		position: relative;
		overflow: visible;
		background: transparent;
	}

	.christmas-lights {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		gap: 2rem;
		padding: 0.5rem;
		z-index: 10;
	}

	.light {
		width: 12px;
		height: 18px;
		background: var(--color);
		border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
		position: relative;
		box-shadow: 
			0 0 10px var(--color),
			0 0 20px var(--color),
			0 0 30px color-mix(in srgb, var(--color) 50%, transparent);
		animation: twinkleLight 1.5s ease-in-out infinite;
		animation-delay: var(--delay);
	}

	.light::before {
		content: '';
		position: absolute;
		top: -4px;
		left: 50%;
		transform: translateX(-50%);
		width: 6px;
		height: 6px;
		background: #374151;
		border-radius: 2px;
	}

	.light::after {
		content: '';
		position: absolute;
		top: -8px;
		left: 50%;
		width: 2rem;
		height: 8px;
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
			opacity: 0.6;
			filter: brightness(0.7);
		}
	}

	.header-decorations {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.deco {
		position: absolute;
		font-size: 1.2rem;
		opacity: 0.12;
		animation: floatDeco 12s ease-in-out infinite;
	}

	.deco-1 { top: 15%; left: 10%; animation-delay: 0s; color: var(--color-frost); }
	.deco-2 { top: 25%; right: 15%; animation-delay: 3s; color: var(--color-primary); }
	.deco-3 { top: 60%; left: 8%; animation-delay: 6s; color: var(--color-accent-light); }
	.deco-4 { top: 40%; right: 10%; animation-delay: 4s; color: var(--color-green-light); }
	.deco-5 { top: 70%; right: 20%; animation-delay: 1.5s; color: var(--color-accent-light); }

	@keyframes floatDeco {
		0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.08; }
		50% { transform: translateY(-5px) rotate(5deg); opacity: 0.18; }
	}

	.header-content {
		max-width: 800px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
	}

	.subtitle {
		font-family: var(--font-body);
		font-size: 1.2rem;
		font-style: italic;
		color: var(--color-text-dim);
		margin-bottom: 0.75rem;
		letter-spacing: 0.08em;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	.subtitle-icon {
		font-size: 0.7rem;
		color: var(--color-primary);
		animation: twinkle 2s ease-in-out infinite;
	}

	.subtitle-icon:last-child {
		animation-delay: 1s;
	}

	@keyframes twinkle {
		0%, 100% { opacity: 0.4; transform: scale(1); }
		50% { opacity: 1; transform: scale(1.3); }
	}

	.title {
		font-family: var(--font-display);
		font-size: clamp(2rem, 6vw, 3.5rem);
		font-weight: 700;
		color: var(--color-primary);
		margin: 0;
		line-height: 1.2;
	}

	.title-text {
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
		text-shadow: none;
		filter: drop-shadow(0 0 30px rgba(240, 193, 75, 0.4));
	}

	@keyframes textShine {
		0% { background-position: 0% center; }
		100% { background-position: 200% center; }
	}

	.tagline {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 500;
		color: var(--color-text-dim);
		margin-top: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.disclaimer {
		font-family: var(--font-body);
		font-size: 0.85rem;
		font-style: italic;
		color: var(--color-text-muted);
		margin-top: 0.6rem;
		opacity: 0.8;
	}

	.countdown-section {
		margin-top: 2rem;
		padding: 1.5rem 2rem;
		background: linear-gradient(135deg, 
			rgba(34, 197, 94, 0.2) 0%, 
			rgba(45, 54, 77, 0.95) 50%,
			rgba(239, 68, 68, 0.15) 100%
		);
		border: 2px solid rgba(255, 213, 79, 0.35);
		border-radius: 20px;
		max-width: 480px;
		margin-left: auto;
		margin-right: auto;
		position: relative;
		overflow: hidden;
		animation: slideUp 0.6s ease;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.countdown-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at 50% 0%, rgba(255, 213, 79, 0.2) 0%, transparent 70%);
		pointer-events: none;
		animation: pulseGlow 3s ease-in-out infinite;
	}

	@keyframes pulseGlow {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}

	.countdown-inner {
		position: relative;
		z-index: 1;
	}

	.countdown-label {
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--color-text-dim);
		margin-bottom: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.countdown-icon {
		font-size: 1.3rem;
		animation: bounce 1s ease-in-out infinite;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-5px); }
	}

	.countdown-timer {
		font-family: var(--font-display);
		font-size: 1.6rem;
		font-weight: 600;
	}

	.timer-value {
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-glow) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 0 20px rgba(240, 193, 75, 0.4));
		letter-spacing: 0.03em;
	}

	.progress-section {
		margin-top: 2rem;
	}

	.progress-bar {
		width: 100%;
		max-width: 400px;
		height: 8px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 4px;
		margin: 0 auto;
		overflow: visible;
		position: relative;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, 
			#b91c1c 0%, 
			#dc2626 20%,
			#ca8a04 50%,
			#16a34a 80%,
			#22c55e 100%
		);
		border-radius: 4px;
		transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.progress-shine {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, 
			transparent 0%, 
			rgba(255, 255, 255, 0.3) 50%, 
			transparent 100%
		);
		animation: shine 2s ease-in-out infinite;
	}

	@keyframes shine {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	.progress-glow {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 20px;
		height: 20px;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 50%;
		filter: blur(8px);
		opacity: 0.6;
		animation: pulseProgress 1.5s ease-in-out infinite;
	}

	@keyframes pulseProgress {
		0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
		50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
	}

	.progress-text {
		font-size: 0.9rem;
		color: var(--color-text-dim);
		margin-top: 0.75rem;
	}

	.progress-count {
		color: var(--color-text);
		font-weight: 700;
	}

	.progress-total {
		color: var(--color-text);
		font-weight: 700;
	}

	.progress-hint {
		display: block;
		font-size: 0.75rem;
		opacity: 0.6;
		margin-top: 0.3rem;
		font-style: italic;
	}

	.reset-btn {
		margin-top: 1.25rem;
		padding: 0.6rem 1.25rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 8px;
		color: var(--color-text-dim);
		font-family: var(--font-body);
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.reset-icon {
		transition: transform 0.3s ease;
	}

	.reset-btn:hover {
		border-color: var(--color-accent);
		color: var(--color-accent-light);
		background: rgba(196, 30, 58, 0.1);
	}

	.reset-btn:hover .reset-icon {
		transform: rotate(-180deg);
	}

	@media (max-width: 600px) {
		.header {
			padding: 2.5rem 0.75rem 1.5rem;
		}

		.christmas-lights {
			gap: 1rem;
			padding: 0.3rem;
		}

		.light {
			width: 8px;
			height: 12px;
		}

		.light::before {
			width: 3px;
			height: 3px;
			top: -2px;
		}

		.subtitle {
			font-size: 1rem;
			gap: 0.5rem;
		}

		.subtitle-icon {
			font-size: 0.5rem;
		}

		.title {
			font-size: clamp(1.5rem, 8vw, 2.5rem);
		}

		.tagline {
			font-size: 0.9rem;
		}

		.disclaimer {
			font-size: 0.75rem;
			margin-top: 0.5rem;
		}

		.countdown-section {
			padding: 0.9rem 1rem;
			margin-top: 1.25rem;
			border-radius: 14px;
			max-width: 100%;
		}

		.countdown-label {
			font-size: 0.8rem;
			flex-wrap: wrap;
			text-align: center;
			line-height: 1.4;
		}

		.countdown-timer {
			font-size: 1.2rem;
		}

		.countdown-icon {
			font-size: 1rem;
		}

		.progress-section {
			margin-top: 1.5rem;
		}

		.progress-bar {
			max-width: 280px;
			height: 6px;
		}

		.progress-text {
			font-size: 0.8rem;
		}

		.progress-hint {
			font-size: 0.7rem;
		}

		.reset-btn {
			font-size: 0.8rem;
			padding: 0.5rem 1rem;
		}

		.deco {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 400px) {
		.header {
			padding: 2rem 0.5rem 1.25rem;
		}

		.christmas-lights {
			gap: 0.5rem;
		}

		.light {
			width: 6px;
			height: 9px;
		}

		.subtitle {
			font-size: 0.85rem;
		}

		.title {
			font-size: clamp(1.3rem, 7vw, 2rem);
		}

		.tagline {
			font-size: 0.75rem;
			letter-spacing: 0.05em;
		}

		.disclaimer {
			font-size: 0.65rem;
		}

		.countdown-section {
			padding: 0.75rem 0.85rem;
			margin-top: 1rem;
		}

		.countdown-label {
			font-size: 0.75rem;
		}

		.countdown-timer {
			font-size: 1.1rem;
		}

		.countdown-icon {
			font-size: 0.9rem;
		}

		.progress-bar {
			max-width: 220px;
		}

		.progress-text {
			font-size: 0.75rem;
		}
	}
</style>
