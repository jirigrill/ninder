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
	iconClass: string;
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
	id: number;
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
	interactionId: number;
	userId: string;
	cardId: number;
	lastChance: boolean;
	swipe: 'liked' | 'disliked' | 'superliked';
};

export type Match = {
	cardId: number;
	name: string;
	meaning: string;
	countries: string[];
	superMatch: boolean;
};

export type Advice = {
	id: number;
	userId: string;
	active: boolean;
};
