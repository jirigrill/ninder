import { createInteraction, isMatch } from '$lib/server/CardInteractionRepository';
import type { AdviceService } from './AdviceService';
import type { SessionService } from './SessionService';
import type { Match, Session } from '$lib/types';
import { deleteMatch, getCardIdsOfMatches, getSuperLikeMatches } from '$lib/server/MatchRepository';
import { getNames } from '$lib/server/CardRepository';

export type CardInteractionResponse = {
	isMatch: boolean;
	success: boolean;
};

export class MatchService {
	private sessionService: SessionService;
	private adviceService: AdviceService;

	constructor(sessionService: SessionService, adviceService: AdviceService) {
		this.sessionService = sessionService;
		this.adviceService = adviceService;
	}

	async getMatches(userId: string, partnerUserId: string): Promise<Match[]> {
		let matchIds = await getCardIdsOfMatches(userId, partnerUserId);
		let superMatches = await getSuperLikeMatches(userId, partnerUserId);
		const cardIds = [...matchIds, ...superMatches];
		const matches = await getNames(cardIds.map((card) => card.id));

		matches.forEach((match) => {
			match.superMatch = superMatches.some((superMatch) => superMatch.id === match.cardId);
			match.countries = match.countries.filter((country) => country[0] !== 'X');
		});

		return matches;
	}

	async deleteMatch(userId: string, partnerUserId: string, cardId: number): Promise<void> {
		return deleteMatch(userId, partnerUserId, cardId);
	}

	async createInteraction(
		nameId: number,
		userId: string,
		action: 'disliked' | 'liked' | 'superliked',
		categoryOrigin: string
	): Promise<CardInteractionResponse> {
		const session = await this.sessionService.getSessionByUserId(userId);
		if (session === undefined) {
			return { isMatch: false, success: false };
		}

		await createInteraction(nameId, userId, session.id, action, categoryOrigin);
		let isLikedByPartner = false;

		if (action === 'liked' || action === 'superliked') {
			const partnerUserId = this.sessionService.getPartnerUserId(userId, session);
			isLikedByPartner = await isMatch(partnerUserId || '', nameId);
			if (isLikedByPartner) {
				await this.adviceService.publishAdvice(session);
			}
		}

		return { isMatch: isLikedByPartner, success: true };
	}
}
