import type { CategoryProgress } from '$lib/types';

export const getCategories = async () => {
	const response = await fetch('/api/categories');
	const data = await response.json();
	return data as CategoryProgress[];
};
