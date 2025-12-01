import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function createClient() {
	// Log for debugging (remove in production)
	if (typeof window !== 'undefined') {
		console.log('Creating Supabase client:', {
			hasUrl: !!PUBLIC_SUPABASE_URL,
			hasKey: !!PUBLIC_SUPABASE_ANON_KEY,
			urlLength: PUBLIC_SUPABASE_URL?.length || 0,
			keyLength: PUBLIC_SUPABASE_ANON_KEY?.length || 0
		});
	}
	
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
		console.error('Missing Supabase environment variables:', {
			hasUrl: !!PUBLIC_SUPABASE_URL,
			hasKey: !!PUBLIC_SUPABASE_ANON_KEY
		});
		throw new Error(
			'Missing Supabase environment variables. Please set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY. ' +
			'See ENVIRONMENT_SETUP.md for instructions.'
		);
	}
	
	// createBrowserClient automatically includes the API key in requests
	const client = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
	
	return client;
}
