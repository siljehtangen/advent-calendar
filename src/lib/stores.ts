import { writable, readable } from 'svelte/store';
import { browser } from '$app/environment';
import { createClient } from '$lib/supabase/client';
import type { Session } from '@supabase/supabase-js';

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
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / 1000);
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

export const session = writable<Session | null>(null);

async function syncOpenedDoorsToSupabase(userId: string, doors: number[]) {
	const supabase = createClient();

	const { data: existingDoors } = await supabase
		.from('opened_doors')
		.select('day')
		.eq('user_id', userId);
	
	const existingDays = existingDoors?.map(d => d.day) || [];
	
	const newDoors = doors.filter(day => !existingDays.includes(day));
	if (newDoors.length > 0) {
		await supabase
			.from('opened_doors')
			.insert(newDoors.map(day => ({ user_id: userId, day })));
	}
}

async function syncQuizAnswersToSupabase(userId: string, answers: Record<number, string>) {
	const supabase = createClient();

	const { data: existingAnswers } = await supabase
		.from('quiz_answers')
		.select('day, answer')
		.eq('user_id', userId);
	
	const existingDays = existingAnswers?.map(a => a.day) || [];
	
	const newAnswers = Object.entries(answers)
		.filter(([day]) => !existingDays.includes(Number(day)))
		.map(([day, answer]) => ({ user_id: userId, day: Number(day), answer }));
	
	if (newAnswers.length > 0) {
		await supabase
			.from('quiz_answers')
			.insert(newAnswers);
	}
}

async function loadFromSupabase(userId: string): Promise<{ doors: number[]; answers: Record<number, string> }> {
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
	let currentSession: Session | null = null;
	let initialized = false;
	
	session.subscribe(s => {
		currentSession = s;
		if (s && browser && !initialized) {
			loadFromSupabase(s.user.id).then(({ doors }) => {
				set(doors);
				initialized = true;
			});
		} else if (!s && browser) {
			const stored = localStorage.getItem('openedDoors');
			if (stored) {
				set(JSON.parse(stored));
			} else {
				set([]);
			}
			initialized = true;
		}
	});
	
	if (browser) {
		const stored = localStorage.getItem('openedDoors');
		if (stored) {
			set(JSON.parse(stored));
		}
	}
	
	return {
		subscribe,
		openDoor: async (day: number) => {
			if (!canOpenDoor(day)) return;
			
			update(doors => {
				if (!doors.includes(day)) {
					const newDoors = [...doors, day];
					
					if (browser) {
						if (currentSession) {
							syncOpenedDoorsToSupabase(currentSession.user.id, newDoors);
						} else {
							localStorage.setItem('openedDoors', JSON.stringify(newDoors));
						}
					}
					
					return newDoors;
				}
				return doors;
			});
		},
		reset: async () => {
			if (browser) {
				if (currentSession) {
					const supabase = createClient();
					await supabase
						.from('opened_doors')
						.delete()
						.eq('user_id', currentSession.user.id);
				} else {
					localStorage.removeItem('openedDoors');
				}
			}
			set([]);
		}
	};
}

function createQuizAnswersStore() {
	const initial: Record<number, string> = {};
	const { subscribe, set, update } = writable<Record<number, string>>(initial);
	let currentSession: Session | null = null;
	let initialized = false;
		
	session.subscribe(s => {
		currentSession = s;
		if (s && browser && !initialized) {
			loadFromSupabase(s.user.id).then(({ answers }) => {
				set(answers);
				initialized = true;
			});
		} else if (!s && browser) {
			const stored = localStorage.getItem('quizAnswers');
			if (stored) {
				set(JSON.parse(stored));
			} else {
				set({});
			}
			initialized = true;
		}
	});
	
	if (browser) {
		const stored = localStorage.getItem('quizAnswers');
		if (stored) {
			set(JSON.parse(stored));
		}
	}
	
	return {
		subscribe,
		saveAnswer: async (day: number, answer: string) => {
			update(answers => {
				if (answers[day] !== undefined) {
					return answers;
				}
				const newAnswers = { ...answers, [day]: answer };
				
				if (browser) {
					if (currentSession) {
						syncQuizAnswersToSupabase(currentSession.user.id, newAnswers);
					} else {
						localStorage.setItem('quizAnswers', JSON.stringify(newAnswers));
					}
				}
				
				return newAnswers;
			});
		},
		reset: async () => {
			if (browser) {
				if (currentSession) {
					const supabase = createClient();
					await supabase
						.from('quiz_answers')
						.delete()
						.eq('user_id', currentSession.user.id);
				} else {
					localStorage.removeItem('quizAnswers');
				}
			}
			set({});
		}
	};
}

export const openedDoors = createOpenedDoorsStore();
export const quizAnswers = createQuizAnswersStore();
export const selectedDoor = writable<number | null>(null);
