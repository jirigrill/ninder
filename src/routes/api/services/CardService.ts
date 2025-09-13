import {
	deleteAllCardInteractions,
	getPartnerCardInteractions
} from '$lib/server/CardInteractionRepository';
import { getNextCards } from '$lib/server/CardRepository';
import type { SessionService } from './SessionService';
import type { Card } from '$lib/types';

export class CardService {
	private sessionService: SessionService;

	constructor(sessionService: SessionService) {
		this.sessionService = sessionService;
	}

	async getNextCards(userId: string, country: string, take: number, sex: string): Promise<Card[]> {
		const session = await this.sessionService.getSessionByUserId(userId);
		const partnerUserId = this.sessionService.getPartnerUserId(userId, session);
		// TODO: For now, allow single-user mode for testing
		const effectivePartnerUserId = partnerUserId || userId;

		const nextCards = await getNextCards(userId, effectivePartnerUserId, country, take, sex);

		const partnerInteractions = await getPartnerCardInteractions(
			effectivePartnerUserId,
			nextCards.map((card) => card.id)
		);

		nextCards.forEach((card) => {
			const interaction = partnerInteractions.find((interaction) => interaction.cardId === card.id);
			if (interaction) {
				card.partnerInteraction = interaction;
			}
		});

		return nextCards;
	}

	async deleteAllCardInteractions(userId: string): Promise<void> {
		const sessionId = await this.sessionService.getSessionByUserId(userId);
		await deleteAllCardInteractions(sessionId?.id || -1);
	}
}
