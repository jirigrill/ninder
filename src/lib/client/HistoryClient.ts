import { getUserStore } from '$lib/FirebaseStore.svelte';

export const pushToHistory = async (categoryId: number): Promise<void> => {
	const idToken = await getUserStore().user?.getIdToken();
	await fetch(`/api/categories/history?category=${categoryId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${idToken}`
		}
	});
};
