import { getUserStore } from '$lib/FirebaseStore.svelte';
import type { Match } from '$lib/types';

export const getMatches = async () => {
	const idToken = await getUserStore().user?.getIdToken();
	const response = await fetch(`/api/matches?user_id=${getUserStore().user?.uid}`, {
		headers: { Authorization: `Bearer ${idToken}` }
	});
	const data = await response.json();
	return (data as Match[]).reverse();
};
