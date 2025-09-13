import { secureAuth } from '$lib/auth-secure';
import type { CategoryProgress } from '$lib/types';

export const getCategories = async (
	sex: 'male' | 'female' | 'all',
	set: 'quick' | 'popular' | 'countries'
) => {
	const user = secureAuth.getCurrentUser();
	if (!user) {
		throw new Error('User not authenticated');
	}

	const response = await fetch(`/api/categories?username=${user.username}&set=${set}&sex=${sex}`, {
		headers: secureAuth.getAuthHeader()
	});
	
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Failed to fetch categories');
	}
	
	const data = await response.json();
	return data as CategoryProgress[];
};
