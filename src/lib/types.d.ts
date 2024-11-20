export type Card = {
	id: number;
	name: string;
	countries: string[];
	meaning: string;
	partnerInteraction: CardInteraction | null;
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

export type Session = {
	pairingCode: string;
	initiatorUserId: string;
	partnerUserId: string | null;
};

export type CreateSession = {
	initiatorUserId: string;
};

export type JoinSession = {
	pairingCode: string;
	partnerUserId: string;
};

export type JoinSession = {
	pairingCode: string;
	partnerUserId: string;
};

export type CardInteraction = {
	userId: string;
	cardId: number;
	swipe: 'liked' | 'disliked' | 'superliked';
};
