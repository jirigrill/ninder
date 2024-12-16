import { getUserStore } from '$lib/FirebaseStore.svelte';
import type { CategoryProgress } from '$lib/types';

export const getCategories = async (sex: string) => {
	const idToken = await getUserStore().user?.getIdToken();
	const response = await fetch(`/api/categories?sex=${sex}`, {
		headers: { Authorization: `Bearer ${idToken}` }
	});
	const data = await response.json();
	return data as CategoryProgress[];
};
