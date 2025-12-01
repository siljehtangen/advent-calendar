import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function createClient() {
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
		throw new Error(
			'Missing Supabase environment variables. Please set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY. ' +
			'See ENVIRONMENT_SETUP.md for instructions.'
		);
	}
	
	return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}
