import { getUserStore } from '$lib/FirebaseStore.svelte';
import type { Session } from '$lib/types';

export const getSession = async () => {
	console.log('t');
	const response = await fetch(`/api/session?user_id=${getUserStore().user?.uid}`);
	const data = await response.json();
	return data as Session;
};
