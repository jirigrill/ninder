import { secureAuth } from '$lib/auth-secure';
import type { Card } from '$lib/types';

export const getCards = async (country: string, take: number, sex: string) => {
	const user = secureAuth.getCurrentUser();
	if (!user) {
		throw new Error('User not authenticated');
	}
	
	const response = await fetch(`/api/cards?username=${user.username}&country=${country}&take=${take}&sex=${sex}`, {
		headers: secureAuth.getAuthHeader()
	});
	
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Failed to fetch cards');
	}
	
	const data = await response.json();
	return (data as Card[]).reverse();
};

export const swipeCard = async (swipeAction: {
	card: Card;
	swipeAction: 'like' | 'dislike' | 'superlike';
	categoryOrigin: string;
}): Promise<boolean> => {
	const user = secureAuth.getCurrentUser();
	if (!user) {
		throw new Error('User not authenticated');
	}
	
	const response = await fetch(
		`/api/cards/${swipeAction.card.id}/${swipeAction.swipeAction}?username=${user.username}&categoryOrigin=${swipeAction.categoryOrigin}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...secureAuth.getAuthHeader()
			}
		}
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Failed to swipe card');
	}

	const json = await response.json();
	return json as boolean;
};
