import { getUserStore } from '$lib/FirebaseStore.svelte';
import type { CategoryProgress } from '$lib/types';

export const getCategories = async (
	sex: 'male' | 'female' | 'all',
	set: 'quick' | 'popular' | 'countries'
) => {
	const idToken = await getUserStore().user?.getIdToken();
	const response = await fetch(`/api/categories?set=${set}&sex=${sex}`, {
		headers: { Authorization: `Bearer ${idToken}` }
	});
	const data = await response.json();
	return data as CategoryProgress[];
};
