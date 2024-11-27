import { browser } from '$app/environment';
import { auth, login } from '$lib/FirebaseStore.svelte';
import { setLanguageTag } from '$lib/paraglide/runtime';
import { QueryClient } from '@tanstack/svelte-query';
import { onAuthStateChanged, type User } from 'firebase/auth';

export const load: PageLoad = async () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	return {
		queryClient
	};
};
