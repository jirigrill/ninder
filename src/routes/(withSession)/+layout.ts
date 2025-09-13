import { browser } from '$app/environment';
import { secureAuth } from '$lib/auth-secure';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	if (browser) {
		// Check if user is authenticated
		const user = secureAuth.getCurrentUser();
		
		// If not authenticated, redirect to auth page
		if (!user) {
			throw redirect(302, '/auth');
		}
		
		return {
			user: user
		};
	}
	
	return {
		user: null
	};
};
