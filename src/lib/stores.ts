import { writable, readable } from 'svelte/store';
import { browser } from '$app/environment';

export function getCurrentDate(): Date {
	return new Date();
}

export function canOpenDoor(day: number): boolean {
	const now = getCurrentDate();
	const currentMonth = now.getMonth();
	const currentDay = now.getDate();
	
	if (currentMonth === 11) {
		return currentDay >= day;
	}
	
	if (currentMonth < 11) {
		return false;
	}
	
	return false;
}

export function getDoorUnlockDate(day: number): Date {
	const now = getCurrentDate();
	const year = now.getMonth() === 11 ? now.getFullYear() : now.getFullYear();
	return new Date(year, 11, day, 0, 0, 0, 0);
}

export function getTimeUntilUnlock(day: number): { days: number; hours: number; minutes: number; seconds: number } | null {
	if (canOpenDoor(day)) return null;
	
	const now = getCurrentDate();
	const unlockDate = getDoorUnlockDate(day);
	const diff = unlockDate.getTime() - now.getTime();
	
	if (diff <= 0) return null;
	
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diff % (1000 * 60)) / 1000);
	
	return { days, hours, minutes, seconds };
}

export function getNextAvailableDoor(): number | null {
	const now = getCurrentDate();
	const currentMonth = now.getMonth();
	const currentDay = now.getDate();
	
	if (currentMonth !== 11) {
		return 1;
	}
	
	if (currentDay >= 24) {
		return null;
	}
	
	return currentDay + 1;
}

export const currentTime = readable(new Date(), (set) => {
	if (!browser) return;
	
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);
	
	return () => clearInterval(interval);
});

function createOpenedDoorsStore() {
	const initial: number[] = [];
	const { subscribe, set, update } = writable<number[]>(initial);
	
	if (browser) {
		const stored = localStorage.getItem('openedDoors');
		if (stored) {
			set(JSON.parse(stored));
		}
	}
	
	return {
		subscribe,
		openDoor: (day: number) => {
			if (!canOpenDoor(day)) return;
			
			update(doors => {
				if (!doors.includes(day)) {
					const newDoors = [...doors, day];
					if (browser) {
						localStorage.setItem('openedDoors', JSON.stringify(newDoors));
					}
					return newDoors;
				}
				return doors;
			});
		},
		reset: () => {
			if (browser) {
				localStorage.removeItem('openedDoors');
			}
			set([]);
		}
	};
}

function createQuizAnswersStore() {
	const initial: Record<number, string> = {};
	const { subscribe, set, update } = writable<Record<number, string>>(initial);
	
	if (browser) {
		const stored = localStorage.getItem('quizAnswers');
		if (stored) {
			set(JSON.parse(stored));
		}
	}
	
	return {
		subscribe,
		saveAnswer: (day: number, answer: string) => {
			update(answers => {
				if (answers[day] !== undefined) {
					return answers;
				}
				const newAnswers = { ...answers, [day]: answer };
				if (browser) {
					localStorage.setItem('quizAnswers', JSON.stringify(newAnswers));
				}
				return newAnswers;
			});
		},
		reset: () => {
			if (browser) {
				localStorage.removeItem('quizAnswers');
			}
			set({});
		}
	};
}

export const openedDoors = createOpenedDoorsStore();
export const quizAnswers = createQuizAnswersStore();
export const selectedDoor = writable<number | null>(null);
