import { secureAuth } from '$lib/auth-secure';
import type { Match } from '$lib/types';

export const getMatches = async () => {
	const user = secureAuth.getCurrentUser();
	if (!user) {
		throw new Error('User not authenticated');
	}
	
	const response = await fetch(`/api/matches?username=${user.username}`, {
		headers: secureAuth.getAuthHeader()
	});
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Failed to fetch matches');
	}
	
	const data = await response.json();
	return (data as Match[]).reverse();
};

export const deleteMatch = async (match: Match) => {
	const user = secureAuth.getCurrentUser();
	if (!user) {
		throw new Error('User not authenticated');
	}
	
	const response = await fetch(`/api/matches?username=${user.username}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			...secureAuth.getAuthHeader()
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
