import { getUserStore } from '$lib/FirebaseStore.svelte';
import type { CategoryProgress } from '$lib/types';

export const getCategories = async () => {
	const idToken = await getUserStore().user?.getIdToken();
	const response = await fetch(`/api/categories`, {
		headers: { Authorization: `Bearer ${idToken}` }
	});
	const data = await response.json();
	return data as CategoryProgress[];
};
