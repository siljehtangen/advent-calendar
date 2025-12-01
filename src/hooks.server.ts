import { createClient } from '$lib/supabase/server';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		event.locals.supabase = createClient(event);
		
		// Use getUser() instead of getSession() for secure authentication
		// getUser() verifies the session with the Supabase Auth server
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error || !user) {
			event.locals.session = null;
		} else {
			// Create a minimal session object from the verified user
			// We've already verified the user with getUser(), so this is safe
			// The session object is only used for passing to components, not for auth decisions
			// Components should use the authenticated user data from layout.server.ts instead
			event.locals.session = {
				user: user,
				access_token: '', // Not needed for our use case
				refresh_token: '', // Not needed for our use case
				expires_in: 0,
				expires_at: null,
				token_type: 'bearer'
			} as any;
		}
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

