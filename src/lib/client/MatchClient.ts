import { getUserStore } from '$lib/FirebaseStore.svelte';
import type { Match } from '$lib/types';

export const getMatches = async () => {
	const idToken = await getUserStore().user?.getIdToken();
	const response = await fetch(`/api/matches`, {
		headers: { Authorization: `Bearer ${idToken}` }
	});
	const data = await response.json();
	return (data as Match[]).reverse();
};

export const deleteMatch = async (match: Match) => {
	const idToken = await getUserStore().user?.getIdToken();
	const response = await fetch(`/api/matches`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${idToken}`
		},
		body: JSON.stringify(match)
	});

	if (response.status === 404) {
		return { error: 'No match found' };
	}

	if (response.status === 500) {
		return { error: 'Failed to delete match' };
	}

	const data = await response.json();
	return data;
};
