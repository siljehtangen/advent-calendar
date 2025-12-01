import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestEvent } from '@sveltejs/kit';

export function createClient(event: RequestEvent) {
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
		throw new Error(
			'Missing Supabase environment variables. Please set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY. ' +
			'See ENVIRONMENT_SETUP.md for instructions.'
		);
	}
	
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
}
