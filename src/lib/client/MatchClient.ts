import { getUserStore } from '$lib/FirebaseStore.svelte';
import type {  Match } from '$lib/types';

export const getMatches = async () => {
	const response = await fetch(
		`/api/matches?user_id=${getUserStore().user?.uid}`
	);
	const data = await response.json();
	return (data as Match[]).reverse();
};
