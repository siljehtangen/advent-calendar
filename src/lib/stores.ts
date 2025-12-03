import { writable, readable } from 'svelte/store';
import { browser } from '$app/environment';
import { createClient } from '$lib/supabase/client';

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

export function canOpenDoorSequentially(day: number, quizAnswersRecord: Record<number, string>): boolean {
	if (!canOpenDoor(day)) return false;
	
	if (day === 1) return true;
	
	for (let i = 1; i < day; i++) {
		if (quizAnswersRecord[i] === undefined) {
			return false;
		}
	}
	
	return true;
}

export function isDoorWaitingForPrevious(day: number, quizAnswersRecord: Record<number, string>): boolean {
	if (!canOpenDoor(day)) return false;
	
	if (canOpenDoorSequentially(day, quizAnswersRecord)) return false;
	
	return true;
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

// Helper functions for Supabase sync
async function syncOpenedDoorToSupabase(userId: string, day: number) {
	if (!browser) return;
	
	const supabase = createClient();
	const { error } = await supabase
		.from('opened_doors')
		.insert({ user_id: userId, day })
		.select()
		.single();
	
	if (error && !error.message.includes('duplicate') && !error.message.includes('unique')) {
		console.error('Error saving opened door to Supabase:', error);
	}
}

async function syncQuizAnswerToSupabase(userId: string, day: number, answer: string) {
	if (!browser) return;
	
	const supabase = createClient();
	const { error } = await supabase
		.from('quiz_answers')
		.insert({ user_id: userId, day, answer })
		.select()
		.single();
	
	if (error && !error.message.includes('duplicate') && !error.message.includes('unique')) {
		console.error('Error saving quiz answer to Supabase:', error);
	}
}

async function loadFromSupabase(userId: string): Promise<{ doors: number[]; answers: Record<number, string> }> {
	if (!browser) return { doors: [], answers: {} };
	
	const supabase = createClient();
	
	const [doorsResult, answersResult] = await Promise.all([
		supabase
			.from('opened_doors')
			.select('day')
			.eq('user_id', userId)
			.order('day'),
		supabase
			.from('quiz_answers')
			.select('day, answer')
			.eq('user_id', userId)
	]);
	
	const doors = doorsResult.data?.map(d => d.day) || [];
	const answers: Record<number, string> = {};
	answersResult.data?.forEach(a => {
		answers[a.day] = a.answer;
	});
	
	return { doors, answers };
}

function createOpenedDoorsStore() {
	const initial: number[] = [];
	const { subscribe, set, update } = writable<number[]>(initial);
	
	let currentUserId: string | null = null;
	
	// Function to initialize with user data
	async function initialize(userId: string | null) {
		currentUserId = userId;
		
		if (browser && userId) {
			// Load from Supabase if authenticated
			const { doors } = await loadFromSupabase(userId);
			set(doors);
			// Also save to localStorage as backup
			localStorage.setItem('openedDoors', JSON.stringify(doors));
		} else if (browser) {
			// Load from localStorage if not authenticated
			const stored = localStorage.getItem('openedDoors');
			if (stored) {
				set(JSON.parse(stored));
			}
		}
	}
	
	return {
		subscribe,
		initialize,
		openDoor: async (day: number) => {
			if (!canOpenDoor(day)) return;
			
			update(doors => {
				if (!doors.includes(day)) {
					const newDoors = [...doors, day];
					if (browser) {
						// Save to Supabase if authenticated
						if (currentUserId) {
							syncOpenedDoorToSupabase(currentUserId, day);
						}
						// Also save to localStorage as backup
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
	
	let currentUserId: string | null = null;
	
	// Function to initialize with user data
	async function initialize(userId: string | null) {
		currentUserId = userId;
		
		if (browser && userId) {
			// Load from Supabase if authenticated
			const { answers } = await loadFromSupabase(userId);
			set(answers);
			// Also save to localStorage as backup
			localStorage.setItem('quizAnswers', JSON.stringify(answers));
		} else if (browser) {
			// Load from localStorage if not authenticated
			const stored = localStorage.getItem('quizAnswers');
			if (stored) {
				set(JSON.parse(stored));
			}
		}
	}
	
	return {
		subscribe,
		initialize,
		saveAnswer: async (day: number, answer: string) => {
			update(answers => {
				if (answers[day] !== undefined) {
					return answers;
				}
				const newAnswers = { ...answers, [day]: answer };
				if (browser) {
					// Save to Supabase if authenticated
					if (currentUserId) {
						syncQuizAnswerToSupabase(currentUserId, day, answer);
					}
					// Also save to localStorage as backup
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
