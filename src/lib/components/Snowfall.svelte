<script lang="ts">
	import { onMount } from 'svelte';

	interface Snowflake {
		id: number;
		left: number;
		animationDuration: number;
		animationDelay: number;
		opacity: number;
		size: number;
		symbol: string;
		swayAmount: number;
		blur: number;
	}

	let snowflakes = $state<Snowflake[]>([]);
	const symbols = ['❄', '❅', '❆', '✦', '✧', '·', '°', '✶'];

	onMount(() => {
		const flakes: Snowflake[] = [];
		for (let i = 0; i < 60; i++) {
			flakes.push({
				id: i,
				left: Math.random() * 100,
				animationDuration: Math.random() * 15 + 12,
				animationDelay: Math.random() * 15,
				opacity: Math.random() * 0.5 + 0.3,
				size: Math.random() * 0.9 + 0.4,
				symbol: symbols[Math.floor(Math.random() * symbols.length)],
				swayAmount: Math.random() * 60 - 30,
				blur: Math.random() > 0.7 ? Math.random() * 2 : 0
			});
		}
		snowflakes = flakes;
	});
</script>

<div class="snowfall" aria-hidden="true">
	{#each snowflakes as flake (flake.id)}
		<span
			class="flake"
			style="
				left: {flake.left}%;
				--duration: {flake.animationDuration}s;
				--delay: {flake.animationDelay}s;
				--sway: {flake.swayAmount}px;
				opacity: {flake.opacity};
				font-size: {flake.size}rem;
				filter: blur({flake.blur}px);
			"
		>
			{flake.symbol}
		</span>
	{/each}
	
	<div class="ambient-particles">
		{#each Array(12) as _, i}
			<span 
				class="ambient-particle"
				style="
					left: {10 + (i * 7.5)}%;
					--float-delay: {i * 0.8}s;
					--float-duration: {4 + (i % 3)}s;
				"
			>✧</span>
		{/each}
	</div>
</div>

<style>
	.snowfall {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 100;
		overflow: hidden;
	}

	.flake {
		position: absolute;
		top: -5vh;
		color: rgba(248, 250, 252, 0.8);
		animation: fall var(--duration) linear infinite;
		animation-delay: var(--delay);
		text-shadow: 0 0 8px rgba(165, 216, 255, 0.6);
		will-change: transform;
	}

	@keyframes fall {
		0% {
			transform: translateY(-5vh) translateX(0) rotate(0deg);
			opacity: 0;
		}
		5% {
			opacity: 1;
		}
		25% {
			transform: translateY(25vh) translateX(var(--sway)) rotate(90deg);
		}
		50% {
			transform: translateY(50vh) translateX(calc(var(--sway) * -0.5)) rotate(180deg);
		}
		75% {
			transform: translateY(75vh) translateX(var(--sway)) rotate(270deg);
		}
		95% {
			opacity: 0.8;
		}
		100% {
			transform: translateY(105vh) translateX(0) rotate(360deg);
			opacity: 0;
		}
	}

	.ambient-particles {
		position: absolute;
		inset: 0;
	}

	.ambient-particle {
		position: absolute;
		top: 30%;
		font-size: 0.5rem;
		color: rgba(240, 193, 75, 0.3);
		animation: floatAmbient var(--float-duration) ease-in-out infinite;
		animation-delay: var(--float-delay);
		text-shadow: 0 0 10px rgba(240, 193, 75, 0.5);
	}

	.ambient-particle:nth-child(even) {
		top: 60%;
		color: rgba(196, 30, 58, 0.25);
		text-shadow: 0 0 10px rgba(196, 30, 58, 0.4);
	}

	.ambient-particle:nth-child(3n) {
		top: 45%;
		color: rgba(46, 168, 96, 0.25);
		text-shadow: 0 0 10px rgba(46, 168, 96, 0.4);
	}

	@keyframes floatAmbient {
		0%, 100% {
			transform: translateY(0) scale(1);
			opacity: 0.3;
		}
		50% {
			transform: translateY(-20px) scale(1.2);
			opacity: 0.7;
		}
	}
</style>
