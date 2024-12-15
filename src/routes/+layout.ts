import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';

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
