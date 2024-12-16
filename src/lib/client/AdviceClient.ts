import { getUserStore } from '$lib/FirebaseStore.svelte';
import type { Advice } from '$lib/types';

export const hasActiveAdvices = async () => {
	const idToken = await getUserStore().user?.getIdToken();
	const response = await fetch(`/api/advices`, {
		headers: { Authorization: `Bearer ${idToken}` }
	});
	const data = (await response.json()) as Advice;
	return data.active;
};

export const deleteAdvices = async () => {
	const idToken = await getUserStore().user?.getIdToken();
	const response = await fetch(`/api/advices`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${idToken}`
		}
	});

	if (response.status === 500) {
		return { error: 'Failed to delete advices' };
	}

	const data = await response.json();
	return data;
};
