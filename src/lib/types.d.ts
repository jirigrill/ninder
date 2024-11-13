export type Card = {
	id: string;
	name: string;
	countries: string[];
	meaning: string;
};

export type CategoryProgress = {
	name: string;
	letterCode: string;
	totalCards: number;
	swipedCards: number;
	id: number;
};

export type Category = {
	name: string;
	letterCode: string | null;
	totalCards: number;
	id: number;
};

export type PartnerSession = {
	pairingCode: string | null;
	initiatorUserId: string;
	partnerUserId: string | null;
};

export type CardInteraction = {
	userId: string;
	cardId: number;
	swipe: 'liked' | 'disliked';
};
