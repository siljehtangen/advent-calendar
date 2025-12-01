import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	// If there's a code parameter, redirect to the callback route to handle it
	const code = url.searchParams.get('code');
	if (code) {
		throw redirect(303, `/auth/callback?code=${code}`);
	}

	// If user is not authenticated, allow them to see the page but they'll need to log in
	return {
		session: locals.session
	};
};

