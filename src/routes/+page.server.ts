import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	// If user is not authenticated, allow them to see the page but they'll need to log in
	return {
		session: locals.session
	};
};

