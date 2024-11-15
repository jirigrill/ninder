import { getUserStore } from '$lib/FirebaseStore.svelte';
import type { CategoryProgress } from '$lib/types';

export const getCategories = async () => {
	const response = await fetch(`/api/categories?user_id=${getUserStore().user.uid}`);
	const data = await response.json();
	return data as CategoryProgress[];
};
