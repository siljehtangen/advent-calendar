<script lang="ts">
	import { selectedDoor, quizAnswers, openedDoors, canOpenDoor, currentTime } from '$lib/stores';
	import { chapters, getChapterContent } from '$lib/storyData';
	import { scale, fly } from 'svelte/transition';

	let selectedAnswer = $state<string | null>(null);
	let hasAnswered = $state(false);

	let chapter = $derived($selectedDoor !== null ? chapters.find(c => c.day === $selectedDoor) : null);
	
	let storyContent = $derived.by(() => {
		if (!chapter) return '';
		return getChapterContent(chapter, $quizAnswers);
	});
	
	let canGoPrevious = $derived.by(() => {
		if ($selectedDoor === null || $selectedDoor <= 1) return false;
		const prevDay = $selectedDoor - 1;
		return $openedDoors.includes(prevDay) && $quizAnswers[prevDay] !== undefined;
	});
	
	let canGoNext = $derived.by(() => {
		$currentTime;
		if ($selectedDoor === null || $selectedDoor >= 24) return false;
		return canOpenDoor($selectedDoor + 1);
	});
	
	let isNextLocked = $derived.by(() => {
		$currentTime;
		if ($selectedDoor === null || $selectedDoor >= 24) return false;
		return !canOpenDoor($selectedDoor + 1);
	});

	// Reset quiz state when door changes
	$effect(() => {
		const currentDoor = $selectedDoor;
		const answers = $quizAnswers;
		
		if (currentDoor !== null && answers[currentDoor] !== undefined) {
			selectedAnswer = answers[currentDoor];
			hasAnswered = true;
		} else {
			selectedAnswer = null;
			hasAnswered = false;
		}
	});

	function closeModal() {
		selectedDoor.set(null);
	}

	function selectAnswer(letter: string) {
		if (hasAnswered) return;
		selectedAnswer = letter;
		hasAnswered = true;
		if ($selectedDoor !== null) {
			quizAnswers.saveAnswer($selectedDoor, letter);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	function goToPrevious() {
		if ($selectedDoor !== null && $selectedDoor > 1 && canGoPrevious) {
			const prevDay = $selectedDoor - 1;
			selectedDoor.set(prevDay);
		}
	}

	function goToNext() {
		if ($selectedDoor !== null && $selectedDoor < 24 && canGoNext) {
			const nextDay = $selectedDoor + 1;
			openedDoors.openDoor(nextDay);
			selectedDoor.set(nextDay);
		}
	}

	function formatContent(text: string): string {
		return text
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.+?)\*/g, '<em>$1</em>')
			.replace(/•/g, '<span class="bullet">•</span>')
			.replace(/\n/g, '<br>');
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $selectedDoor !== null && chapter}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div 
		class="modal-backdrop" 
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<div class="modal">
			<button class="close-btn" onclick={closeModal} aria-label="Lukk">
				<span class="close-icon">✕</span>
			</button>

			<header class="modal-header">
				<div class="day-badge">
					<span class="badge-icon">🎄</span>
					<span class="badge-text">LUKE {chapter.day}</span>
					<span class="badge-icon">🎄</span>
				</div>
				<h2 id="modal-title">{chapter.title}</h2>
			</header>

			<div class="modal-content">
				<div class="story-text">
					{@html formatContent(storyContent)}
				</div>

				<div class="quiz-section" class:finale={!chapter.quiz.options}>
					<div class="quiz-header">
						<span class="quiz-icon">{chapter.quiz.options ? '🎅' : '✨'}</span>
						<h3 class="quiz-question">{chapter.quiz.question}</h3>
					</div>
					{#if chapter.quiz.options}
						<div class="quiz-options">
							{#each chapter.quiz.options as option, i}
								<button
									class="quiz-option"
									class:selected={selectedAnswer === option.letter}
									class:disabled={hasAnswered && selectedAnswer !== option.letter}
									onclick={() => selectAnswer(option.letter)}
									disabled={hasAnswered && selectedAnswer !== option.letter}
									style="--delay: {i * 0.05}s"
								>
									<span class="option-letter">{option.letter}</span>
									<span class="option-text">{option.text}</span>
									{#if selectedAnswer === option.letter}
										<span class="check-mark" transition:scale>✓</span>
									{/if}
								</button>
							{/each}
						</div>
						{#if hasAnswered}
							<p class="answer-saved" transition:fly={{ y: 10, duration: 300 }}>
								Ditt valg er lagret!
							</p>
						{/if}
					{:else if chapter.quiz.note}
						<div class="finale-note">
							{@html formatContent(chapter.quiz.note)}
						</div>
					{/if}
				</div>
			</div>

			<footer class="modal-footer">
				<button 
					class="nav-btn prev-btn" 
					onclick={goToPrevious}
					disabled={$selectedDoor === 1 || !canGoPrevious}
					title={$selectedDoor === 1 ? '' : (!canGoPrevious ? 'Ingen tidligere besvarte luker' : '')}
				>
					<span class="nav-arrow">←</span>
					<span class="nav-text">Forrige</span>
				</button>
				<button 
					class="nav-btn next-btn" 
					onclick={goToNext}
					disabled={!canGoNext}
					title={isNextLocked ? 'Du må vente til neste dag' : ($selectedDoor === 24 ? '' : '')}
				>
					<span class="nav-text">Neste</span>
					<span class="nav-arrow">→</span>
				</button>
			</footer>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(10, 15, 25, 0.95);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		z-index: 1000;
		overflow-y: auto;
		animation: fadeIn 0.15s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal {
		animation: slideUp 0.2s ease-out;
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.modal {
		position: relative;
		width: 100%;
		max-width: 720px;
		max-height: 90vh;
		background: linear-gradient(165deg, 
			#2a3548 0%, 
			#1e2736 30%,
			#161d28 70%,
			#121820 100%
		);
		border: none;
		border-radius: 24px;
		box-shadow: 
			0 30px 100px rgba(0, 0, 0, 0.7),
			0 0 80px rgba(255, 213, 79, 0.1),
			0 0 120px rgba(239, 68, 68, 0.08);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 44px;
		height: 44px;
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 50%;
		color: var(--color-accent-light);
		font-size: 1.2rem;
		cursor: pointer;
		transition: all 0.3s ease;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-icon {
		transition: transform 0.3s ease;
	}

	.close-btn:hover {
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.15));
		border-color: rgba(239, 68, 68, 0.5);
		transform: scale(1.1);
		box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
	}

	.close-btn:hover .close-icon {
		transform: rotate(90deg);
	}

	.modal-header {
		padding: 2.5rem 2rem 1.5rem;
		text-align: center;
		position: relative;
	}

	.day-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 0.5rem 1.25rem;
		background: linear-gradient(135deg, 
			rgba(239, 68, 68, 0.25) 0%, 
			rgba(255, 213, 79, 0.2) 50%,
			rgba(74, 222, 128, 0.25) 100%
		);
		border: 1px solid rgba(255, 213, 79, 0.4);
		border-radius: 25px;
		margin-bottom: 1rem;
		box-shadow: 0 4px 20px rgba(255, 213, 79, 0.15);
	}

	.badge-icon {
		width: 1rem;
		height: 1rem;
		color: var(--color-green-light);
		filter: drop-shadow(0 0 3px rgba(74, 222, 128, 0.6));
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.badge-text {
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		background: linear-gradient(90deg, var(--color-accent-light), var(--color-primary), var(--color-green-light));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.modal-header h2 {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 4vw, 2.2rem);
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 1rem;
		text-shadow: 0 0 40px rgba(255, 213, 79, 0.3);
	}


	.modal-content {
		padding: 1.5rem 2rem;
		flex: 1;
		overflow-y: auto;
	}

	.story-text {
		font-family: var(--font-body);
		font-size: 1.2rem;
		line-height: 1.9;
		color: var(--color-text);
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
		border-radius: 16px;
		border-left: 3px solid rgba(255, 213, 79, 0.4);
	}

	.story-text :global(strong) {
		color: var(--color-primary);
		font-weight: 600;
	}

	.story-text :global(em) {
		color: var(--color-text-dim);
		font-style: italic;
	}

	.story-text :global(.bullet) {
		color: var(--color-accent-light);
		margin-right: 0.5rem;
	}

	.quiz-section {
		background: linear-gradient(135deg, 
			rgba(74, 222, 128, 0.1) 0%, 
			rgba(35, 42, 61, 0.8) 50%,
			rgba(239, 68, 68, 0.08) 100%
		);
		border: 2px solid rgba(74, 222, 128, 0.3);
		border-radius: 20px;
		padding: 1.75rem;
		position: relative;
		overflow: hidden;
	}

	.quiz-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--color-green-light), var(--color-primary), var(--color-accent-light));
	}

	.quiz-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.quiz-icon {
		width: 1.5rem;
		height: 1.5rem;
		color: var(--color-primary);
		animation: pulse 2s ease-in-out infinite;
		line-height: 1;
		vertical-align: middle;
		display: inline-flex;
		align-items: center;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.1); }
	}

	.quiz-question {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--color-primary);
		margin: 0;
		line-height: 1.4;
	}

	.quiz-options {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.quiz-option {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		padding: 1.1rem 1.25rem;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 14px;
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: 1rem;
		text-align: left;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		position: relative;
		animation: optionAppear 0.4s ease forwards;
		animation-delay: var(--delay);
		opacity: 0;
	}

	@keyframes optionAppear {
		from { opacity: 0; transform: translateX(-10px); }
		to { opacity: 1; transform: translateX(0); }
	}

	.quiz-option:hover:not(.disabled) {
		background: linear-gradient(135deg, rgba(255, 213, 79, 0.15), rgba(255, 213, 79, 0.05));
		border-color: rgba(255, 213, 79, 0.4);
		transform: translateX(6px);
		box-shadow: 0 4px 20px rgba(255, 213, 79, 0.15);
	}

	.quiz-option.selected {
		background: linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(74, 222, 128, 0.1));
		border-color: var(--color-green-light);
		box-shadow: 
			0 0 30px rgba(74, 222, 128, 0.25),
			inset 0 0 20px rgba(74, 222, 128, 0.1);
	}

	.quiz-option.disabled {
		opacity: 0.35;
		cursor: default;
	}

	.option-letter {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: linear-gradient(135deg, rgba(255, 213, 79, 0.3), rgba(255, 213, 79, 0.15));
		border-radius: 10px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-primary);
		flex-shrink: 0;
		transition: all 0.3s ease;
	}

	.selected .option-letter {
		background: linear-gradient(135deg, var(--color-green-light), var(--color-green));
		color: white;
		box-shadow: 0 0 15px rgba(74, 222, 128, 0.4);
	}

	.option-text {
		flex: 1;
	}

	.check-mark {
		font-size: 1.2rem;
		color: var(--color-green-light);
		text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
	}

	.answer-saved {
		margin-top: 1.25rem;
		text-align: center;
		color: var(--color-green-light);
		font-size: 1rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.quiz-section.finale {
		background: linear-gradient(135deg, 
			rgba(255, 213, 79, 0.15) 0%, 
			rgba(35, 42, 61, 0.9) 50%,
			rgba(239, 68, 68, 0.1) 100%
		);
		border-color: rgba(255, 213, 79, 0.4);
	}

	.quiz-section.finale::before {
		background: linear-gradient(90deg, var(--color-primary), var(--color-primary-glow), var(--color-primary));
	}

	.finale-note {
		font-family: var(--font-body);
		font-size: 1.05rem;
		line-height: 1.8;
		color: var(--color-text);
		text-align: center;
		padding: 1rem 0;
	}

	.finale-note :global(em) {
		color: var(--color-primary);
		font-style: italic;
		font-weight: 500;
	}

	.modal-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 2rem 1.75rem;
		background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.2));
	}


	.nav-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.85rem 1.5rem;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
		border: 2px solid rgba(255, 255, 255, 0.15);
		border-radius: 12px;
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.nav-arrow {
		font-size: 1.1rem;
		transition: transform 0.3s ease;
	}

	.prev-btn:hover:not(:disabled) .nav-arrow {
		transform: translateX(-4px);
	}

	.next-btn:hover:not(:disabled) .nav-arrow {
		transform: translateX(4px);
	}

	.nav-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, rgba(255, 213, 79, 0.2), rgba(255, 213, 79, 0.08));
		border-color: rgba(255, 213, 79, 0.4);
		box-shadow: 0 4px 20px rgba(255, 213, 79, 0.15);
	}

	.nav-btn:disabled {
		opacity: 0.25;
		cursor: default;
	}

	@media (max-width: 600px) {
		.modal-backdrop {
			padding: 0;
			align-items: flex-end;
		}

		.modal {
			max-height: 92vh;
			border-radius: 20px 20px 0 0;
			margin-top: auto;
		}

		.modal-content {
			padding: 1rem;
			padding-top: 0.5rem;
		}

		.modal-header {
			padding: 1rem 1rem 0.75rem;
			padding-top: 3rem;
		}

		.modal-header h2 {
			font-size: 1.3rem;
		}

		.day-badge {
			padding: 0.4rem 1rem;
			font-size: 0.8rem;
		}

		.badge-icon {
			width: 0.9rem;
			height: 0.9rem;
		}

		.story-text {
			padding: 1rem;
			font-size: 1.05rem;
			line-height: 1.7;
		}

		.quiz-section {
			padding: 1.25rem;
			border-radius: 16px;
		}

		.quiz-header {
			gap: 0.5rem;
			align-items: flex-start;
		}

		.quiz-icon {
			width: 0.95rem;
			height: 0.95rem;
			flex-shrink: 0;
			margin-top: 0.1rem;
		}

		.quiz-question {
			font-size: 0.9rem;
			line-height: 1.4;
		}

		.quiz-options {
			gap: 0.6rem;
		}

		.quiz-option {
			padding: 0.75rem 0.8rem;
			gap: 0.5rem;
			border-radius: 10px;
		}

		.option-letter {
			width: 24px;
			height: 24px;
			font-size: 0.75rem;
			border-radius: 6px;
		}

		.option-text {
			font-size: 0.85rem;
			line-height: 1.3;
		}

		.check-mark {
			font-size: 0.9rem;
		}


		.modal-footer {
			padding: 1rem 1rem 1.5rem;
			padding-bottom: max(1.5rem, env(safe-area-inset-bottom, 1.5rem));
		}

		.nav-btn {
			padding: 0.7rem 1rem;
			font-size: 0.85rem;
			border-radius: 10px;
		}

		.nav-arrow {
			font-size: 1rem;
		}

		.close-btn {
			width: 36px;
			height: 36px;
			top: 0.75rem;
			right: 0.75rem;
			font-size: 1rem;
			z-index: 20;
			position: absolute;
		}

		.answer-saved {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 400px) {
		.modal {
			border-radius: 16px 16px 0 0;
			max-height: 94vh;
		}

		.modal-header {
			padding-top: 2.5rem;
		}

		.day-badge {
			padding: 0.35rem 0.85rem;
			gap: 0.4rem;
		}

		.badge-icon {
			width: 0.85rem;
			height: 0.85rem;
		}

		.badge-text {
			font-size: 0.75rem;
		}

		.story-text {
			font-size: 0.95rem;
			padding: 0.75rem;
		}

		.quiz-section {
			padding: 0.9rem;
		}

		.quiz-icon {
			width: 0.85rem;
			height: 0.85rem;
		}

		.quiz-question {
			font-size: 0.85rem;
		}

		.quiz-option {
			padding: 0.65rem 0.7rem;
			gap: 0.4rem;
		}

		.option-letter {
			width: 22px;
			height: 22px;
			font-size: 0.7rem;
			border-radius: 5px;
		}

		.option-text {
			font-size: 0.8rem;
		}

		.check-mark {
			font-size: 0.8rem;
		}

		.answer-saved {
			font-size: 0.8rem;
			gap: 0.35rem;
		}

		.nav-btn {
			padding: 0.6rem 0.8rem;
			font-size: 0.8rem;
		}

		.nav-text {
			display: none;
		}

		.nav-arrow {
			font-size: 1.1rem;
		}

		.close-btn {
			width: 32px;
			height: 32px;
			font-size: 0.85rem;
			top: 0.5rem;
			right: 0.5rem;
			z-index: 20;
		}
	}
</style>
