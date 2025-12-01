<script lang="ts">
	import { openedDoors, selectedDoor, canOpenDoor, currentTime, getTimeUntilUnlock, quizAnswers } from '$lib/stores';

	interface Props {
		day: number;
	}

	let { day }: Props = $props();

	let isOpened = $derived($openedDoors.includes(day));
	let hasAnswer = $derived($quizAnswers[day] !== undefined);
	let isCompleted = $derived(isOpened && hasAnswer);
	
	let isAvailable = $derived.by(() => {
		$currentTime;
		return canOpenDoor(day);
	});
	
	let isLocked = $derived(!isAvailable);
	
	let countdown = $derived.by(() => {
		if (!isLocked) return null;
		$currentTime;
		return getTimeUntilUnlock(day);
	});

	function handleClick() {
		if (isLocked) return;
		selectedDoor.set(day);
		openedDoors.openDoor(day);
	}

	const shimmerDelay = (day * 0.3) % 2;
</script>

<button
	class="door"
	class:completed={isCompleted}
	class:opened={isOpened && !isCompleted}
	class:available={isAvailable && !isOpened}
	class:locked={isLocked}
	class:special={day === 24}
	onclick={handleClick}
	aria-label={isLocked ? `Luke ${day} - åpner ${day}. desember` : `Åpne luke ${day}`}
	disabled={isLocked}
	style="--shimmer-delay: {shimmerDelay}s;"
>
	<div class="door-bg">
		<div class="shimmer"></div>
	</div>
	
	<div class="door-content">
		<span class="day-number">{day}</span>
	</div>
	
	{#if isLocked && countdown}
		<div class="countdown-tooltip">
			<span class="tooltip-arrow"></span>
			<span class="tooltip-content">
				{#if countdown.days > 0}
					{countdown.days}d {countdown.hours}t
				{:else if countdown.hours > 0}
					{countdown.hours}t {countdown.minutes}m
				{:else}
					{countdown.minutes}m {countdown.seconds}s
				{/if}
			</span>
		</div>
	{/if}
</button>

<style>
	.door {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		overflow: visible;
	}

	.door:hover {
		transform: scale(1.12) translateY(-6px);
	}

	.door:active {
		transform: scale(1.05) translateY(-3px);
	}

	.door-bg {
		position: absolute;
		inset: 0;
		border-radius: 16px;
		background: linear-gradient(145deg, 
			#3a4562 0%, 
			#2d364d 50%,
			#232a3d 100%
		);
		border: 2px solid rgba(255, 255, 255, 0.15);
		overflow: hidden;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	}

	.shimmer {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			105deg,
			transparent 40%,
			rgba(255, 255, 255, 0.08) 45%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.08) 55%,
			transparent 60%
		);
		animation: shimmer 6s ease-in-out infinite;
		animation-delay: calc(var(--shimmer-delay) * 3);
	}

	@keyframes shimmer {
		0%, 100% { transform: translateX(-100%); }
		50% { transform: translateX(100%); }
	}

	.door-content {
		position: absolute;
		inset: 0;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.day-number {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 4vw, 2.4rem);
		font-weight: 700;
		letter-spacing: 0.02em;
		line-height: 1;
		transition: color 0.3s ease, text-shadow 0.3s ease;
	}

	.door.available .door-bg {
		border-color: rgba(255, 213, 79, 0.4);
		background: linear-gradient(145deg, 
			#4a5572 0%, 
			#3a4562 50%,
			#2d364d 100%
		);
	}

	.door.available:hover .door-bg {
		border-color: rgba(255, 213, 79, 0.7);
		box-shadow: 
			0 8px 30px rgba(0, 0, 0, 0.3),
			0 0 40px rgba(255, 213, 79, 0.2);
	}

	.door.available .day-number {
		color: #ffffff;
		text-shadow: 
			0 0 15px rgba(255, 255, 255, 0.6),
			0 0 30px rgba(255, 213, 79, 0.4),
			0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.door.available:hover .day-number {
		text-shadow: 
			0 0 25px rgba(255, 255, 255, 0.9),
			0 0 50px rgba(255, 213, 79, 0.5),
			0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.door.opened .door-bg {
		border-color: rgba(255, 213, 79, 0.5);
		background: linear-gradient(145deg, 
			#4a4535 0%, 
			#3d3a2d 50%,
			#2d2a20 100%
		);
	}

	.door.opened .day-number {
		color: var(--color-primary);
		text-shadow: 
			0 0 20px rgba(255, 213, 79, 0.6),
			0 0 40px rgba(255, 213, 79, 0.3),
			0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.door.completed .door-bg {
		border-color: rgba(74, 222, 128, 0.5);
		background: linear-gradient(145deg, 
			#2a4a35 0%, 
			#1f3d2a 50%,
			#153020 100%
		);
	}

	.door.completed .day-number {
		color: #4ade80;
		animation: blinkGreen 3s ease-in-out infinite;
	}

	@keyframes blinkGreen {
		0%, 100% { 
			color: #4ade80;
			text-shadow: 
				0 0 15px rgba(74, 222, 128, 0.5),
				0 2px 4px rgba(0, 0, 0, 0.3);
		}
		50% { 
			color: #86efac;
			text-shadow: 
				0 0 30px rgba(74, 222, 128, 0.9),
				0 0 60px rgba(74, 222, 128, 0.5),
				0 2px 4px rgba(0, 0, 0, 0.3);
		}
	}

	.door.completed:hover .door-bg {
		border-color: rgba(74, 222, 128, 0.8);
		box-shadow: 
			0 8px 30px rgba(0, 0, 0, 0.3),
			0 0 40px rgba(74, 222, 128, 0.3);
	}

	.door.locked {
		cursor: default;
	}

	.door.locked:hover {
		transform: scale(1.03);
	}

	.door.locked .door-bg {
		background: linear-gradient(145deg, 
			#4a2a35 0%, 
			#3d1f28 50%,
			#2d151c 100%
		);
		border-color: rgba(248, 113, 113, 0.35);
	}

	.door.locked:hover .door-bg {
		border-color: rgba(248, 113, 113, 0.5);
	}

	.door.locked .shimmer {
		background: linear-gradient(
			105deg,
			transparent 40%,
			rgba(248, 113, 113, 0.08) 45%,
			rgba(248, 113, 113, 0.15) 50%,
			rgba(248, 113, 113, 0.08) 55%,
			transparent 60%
		);
	}

	.door.locked .day-number {
		color: #f87171;
		text-shadow: 0 0 15px rgba(248, 113, 113, 0.4);
		opacity: 0.85;
	}

	.door.special.available .door-bg,
	.door.special.opened .door-bg {
		background: linear-gradient(145deg, 
			#5a2a3a 0%, 
			#4a1f2d 40%,
			#3a1522 100%
		);
		border-color: rgba(248, 113, 113, 0.5);
	}

	.door.special.available .day-number,
	.door.special.opened .day-number {
		color: #fca5a5;
		text-shadow: 
			0 0 20px rgba(248, 113, 113, 0.7),
			0 0 40px rgba(248, 113, 113, 0.4),
			0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.door.special.available:hover .door-bg,
	.door.special.opened:hover .door-bg {
		box-shadow: 
			0 8px 30px rgba(0, 0, 0, 0.3),
			0 0 50px rgba(248, 113, 113, 0.3);
	}

	.countdown-tooltip {
		position: absolute;
		bottom: calc(100% + 14px);
		left: 50%;
		transform: translateX(-50%) scale(0.9) translateY(5px);
		background: linear-gradient(135deg, #3d2a35 0%, #2d1f28 100%);
		border: 1px solid rgba(248, 113, 113, 0.5);
		border-radius: 10px;
		padding: 0.5rem 0.85rem;
		opacity: 0;
		pointer-events: none;
		transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
		z-index: 1000;
		box-shadow: 
			0 10px 30px rgba(0, 0, 0, 0.4),
			0 0 25px rgba(248, 113, 113, 0.2);
	}

	.tooltip-arrow {
		position: absolute;
		bottom: -7px;
		left: 50%;
		transform: translateX(-50%) rotate(45deg);
		width: 12px;
		height: 12px;
		background: linear-gradient(135deg, transparent 50%, #2d1f28 50%);
		border-right: 1px solid rgba(248, 113, 113, 0.5);
		border-bottom: 1px solid rgba(248, 113, 113, 0.5);
	}

	.tooltip-content {
		font-size: 0.75rem;
		color: #fca5a5;
		font-family: var(--font-display);
		white-space: nowrap;
		font-weight: 600;
		letter-spacing: 0.06em;
	}

	.door.locked:hover .countdown-tooltip {
		opacity: 1;
		transform: translateX(-50%) scale(1) translateY(0);
	}

	@media (max-width: 600px) {
		.door-bg {
			border-radius: 12px;
		}

		.day-number {
			font-size: clamp(1.2rem, 5vw, 1.8rem);
		}

		.countdown-tooltip {
			padding: 0.4rem 0.7rem;
			border-radius: 8px;
			bottom: calc(100% + 10px);
		}

		.tooltip-content {
			font-size: 0.65rem;
		}

		.door:hover {
			transform: scale(1.08) translateY(-4px);
		}
	}

	@media (max-width: 400px) {
		.door-bg {
			border-radius: 10px;
			border-width: 1.5px;
		}

		.day-number {
			font-size: clamp(1rem, 5vw, 1.5rem);
		}
	}
</style>
