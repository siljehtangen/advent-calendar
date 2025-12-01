import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Verify user authentication using getUser() for security
	let authenticatedUser = null;
	
	if (locals.supabase) {
		const {
			data: { user },
			error
		} = await locals.supabase.auth.getUser();
		
		if (!error && user) {
			authenticatedUser = {
				id: user.id,
				email: user.email ?? null
			};
		}
	}

	return {
		session: locals.session,
		user: authenticatedUser // Pass authenticated user data separately
	};
};

