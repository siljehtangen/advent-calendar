import { createClient } from '$lib/supabase/server';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		event.locals.supabase = createClient(event);
		
		// Refresh session if expired
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		event.locals.session = session;
	} catch (error) {
		console.error('Error initializing Supabase client:', error);
		// Set a default empty session if Supabase fails to initialize
		event.locals.session = null;
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});

	return response;
};

