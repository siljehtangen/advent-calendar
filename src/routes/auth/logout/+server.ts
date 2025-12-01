import { createClient } from '$lib/supabase/server';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const supabase = createClient(event);
	await supabase.auth.signOut();
	throw redirect(303, '/');
};

