import type { Category, CategoryProgress } from '$lib/types';
import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import { getCategories } from '$lib/server/CategoryRepository';
import {
	getCardInteractions,
	getLikedByPartner,
	getPartnerCardInteractions,
	type InteractedCards
} from '$lib/server/CardInteractionRepository';
import { getPartnerUserId } from '$lib/server/SessionRepository';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const url = new URL(event.request.url);
	const sex = url.searchParams.get('sex') || 'all';
	const set = url.searchParams.get('set') || 'quick';

	try {
		const categories = await getCategories(set, userId);
		const interactedCards = await getCardInteractions(userId, sex);
		let categoryProgress: CategoryProgress[] = calculateCountryCategoryProgress(
			interactedCards,
			categories,
			sex
		);
		categoryProgress = calculateMixedCategoryProgress(categoryProgress, interactedCards);
		if (set === 'popular' || set === 'quick') {
			categoryProgress = await enhanceWithPartnerCategory(userId, categoryProgress, sex);
		}
		return json(categoryProgress);
	} catch {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
};

async function enhanceWithPartnerCategory(
	userId: string,
	categoryProgress: CategoryProgress[],
	sex: string
) {
	const partnerUserId = await getPartnerUserId(userId);
	const partnerInteractions = await getLikedByPartner(partnerUserId || '', sex);
	const ownInteractions = await getPartnerCardInteractions(
		userId,
		partnerInteractions.map((i) => i.cardId)
	);

	const index = categoryProgress.findIndex((c) => c.letterCode === 'XDP');
	if (index === -1) {
		return categoryProgress;
	}

	categoryProgress[index].totalCards = partnerInteractions.length;
	categoryProgress[index].swipedCards = ownInteractions.length;

	return categoryProgress;
}

function calculateCountryCategoryProgress(
	interactedCards: InteractedCards[],
	categories: {
		name: string;
		id: number;
		letter_code: string | null;
		total_cards: number | null;
		total_male_cards: number;
		total_female_cards: number;
		icon_class: string;
		visible: boolean | null;
	}[],
	sex: string
) {
	const categoryProgress: CategoryProgress[] = categories.map((category) => ({
		name: category.name,
		letterCode: category.letter_code ?? '',
		totalCards: getTotalCards(sex, category),
		swipedCards: calculateCardCountForCategory(interactedCards, category.id),
		iconClass: category.icon_class,
		id: category.id
	}));
	return categoryProgress;
}

function getTotalCards(
	sex: string,
	category: {
		name: string;
		id: number;
		letter_code: string | null;
		total_cards: number | null;
		total_male_cards: number;
		total_female_cards: number;
		visible: boolean | null;
	}
): number {
	if (sex === 'male') {
		return category.total_male_cards;
	} else if (sex == 'female') {
		return category.total_female_cards;
	}

	return category.total_cards ?? 0;
}

function calculateMixedCategoryProgress(
	categoryProgress: CategoryProgress[],
	interactedCards: InteractedCards[]
) {
	const mixedCategoryId = 1;
	const mixedCategory = categoryProgress.find((category) => category.id === mixedCategoryId);
	if (mixedCategory) {
		mixedCategory.swipedCards = interactedCards.length;
	}

	return categoryProgress;
}

function calculateCardCountForCategory(interactedCards: InteractedCards[], categoryId: number) {
	const interactedCardsInCategory = interactedCards.filter((card) =>
		card.categories.includes(categoryId)
	);
	return interactedCardsInCategory.length;
}
