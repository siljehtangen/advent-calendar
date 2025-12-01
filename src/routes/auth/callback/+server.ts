import { createClient } from '$lib/supabase/server';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get('code');
	const next = event.url.searchParams.get('next') ?? '/';

	if (code) {
		const supabase = createClient(event);
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);
		
		if (error) {
			console.error('Error exchanging code for session:', error);
			// Redirect to home with error message
			throw redirect(303, '/?error=auth_failed');
		}

		if (data.session) {
			// Successfully exchanged code for session
			const redirectTo = next.startsWith('/') ? next : `/${next}`;
			throw redirect(303, redirectTo);
		}
	}

	// No code provided or exchange failed - redirect to home
	throw redirect(303, '/');
};

