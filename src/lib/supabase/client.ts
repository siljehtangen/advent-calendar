import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function createClient() {
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
		console.error('Missing Supabase environment variables:', {
			hasUrl: !!PUBLIC_SUPABASE_URL,
			hasKey: !!PUBLIC_SUPABASE_ANON_KEY,
			url: PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
			keyPrefix: PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) + '...'
		});
		throw new Error(
			'Missing Supabase environment variables. Please set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY. ' +
			'See ENVIRONMENT_SETUP.md for instructions.'
		);
	}
	
	const client = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
	
	// Verify client is properly initialized
	if (!client) {
		throw new Error('Failed to create Supabase client');
	}
	
	return client;
}
