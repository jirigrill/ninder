import {
	getCardInteractions,
	getLikedByPartner,
	getPartnerCardInteractions,
	type InteractedCards
} from '$lib/server/CardInteractionRepository';
import { getCategories } from '$lib/server/CategoryRepository';
import type { CategoryProgress } from '$lib/types';
import { SessionService } from './SessionService';

export class CategoryService {
	private sessionService: SessionService;

	constructor(sessionService: SessionService) {
		this.sessionService = sessionService;
	}

	async getCategories(set: string, sex: string, userId: string): Promise<CategoryProgress[]> {
		const categories = await getCategories(set, userId);
		const interactedCards = await getCardInteractions(userId, sex);

		let categoryProgress: CategoryProgress[] = this.#calculateCountryCategoryProgress(
			interactedCards,
			categories,
			sex
		);
		categoryProgress = this.#calculateMixedCategoryProgress(categoryProgress, interactedCards);
		if (set === 'popular' || set === 'quick') {
			categoryProgress = await this.#enhanceWithPartnerCategory(userId, categoryProgress, sex);
		}

		return categoryProgress;
	}

	async #enhanceWithPartnerCategory(
		userId: string,
		categoryProgress: CategoryProgress[],
		sex: string
	) {
		const session = await this.sessionService.getSessionByUserId(userId);
		const partnerUserId = this.sessionService.getPartnerUserId(userId, session);
		const partnerInteractions = await getLikedByPartner(partnerUserId || '', sex);
		let ownInteractions = await getPartnerCardInteractions(
			userId,
			partnerInteractions.map((i) => i.cardId)
		);
		ownInteractions = ownInteractions.filter(
			(i) => i.swipe == 'liked' || i.swipe == 'superliked' || !i.lastChance
		);

		const index = categoryProgress.findIndex((c) => c.letterCode === 'XDP');
		if (index === -1) {
			return categoryProgress;
		}

		categoryProgress[index].totalCards = partnerInteractions.length;
		categoryProgress[index].swipedCards = ownInteractions.length;

		return categoryProgress;
	}

	#calculateCountryCategoryProgress(
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
			totalCards: this.#getTotalCards(sex, category),
			swipedCards: this.#calculateCardCountForCategory(interactedCards, category.id),
			iconClass: category.icon_class,
			id: category.id
		}));
		return categoryProgress;
	}

	#getTotalCards(
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

	#calculateMixedCategoryProgress(
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

	#calculateCardCountForCategory(interactedCards: InteractedCards[], categoryId: number) {
		const interactedCardsInCategory = interactedCards.filter((card) =>
			card.categories.includes(categoryId)
		);
		return interactedCardsInCategory.length;
	}
}
