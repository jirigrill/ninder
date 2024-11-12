import {
	Firestore,
	collection,
	query,
	where,
	getDocs,
	doc,
	setDoc,
	updateDoc
} from 'firebase/firestore';
import type { Card, CardInteraction } from './types';
import json from '$lib/data/names.json';

let cursor = 0;

export class CardRepository {
	private db: Firestore;
	private interactionCollectionName: string = 'cardInteractions';

	constructor(db: Firestore) {
		this.db = db;
	}

	getNextCards(country: string | null, take: number): Card[] {
		if (country == null) {
			country = 'Gemischt';
		}

		const cards: Card[] = json;
		let filter = cards.filter((name) => name.countries.includes(country.toLocaleUpperCase()));
		return filter.slice(0, take);
	}

	async like(userId: string, cardId: number, country: string | null): Promise<void> {
		if (country == null) {
			country = 'Gemischt';
		}
		await this.storeInteraction(userId, cardId, 'liked');
		await this.moveCursor(country);
	}

	async dislike(userId: string, cardId: number, country: string | null): Promise<void> {
		if (country == null) {
			country = 'Gemischt';
		}
		await this.storeInteraction(userId, cardId, 'disliked');
		await this.moveCursor(country);
	}

	private async storeInteraction(
		userId: string,
		cardId: number,
		swipe: 'liked' | 'disliked'
	): Promise<void> {
		const interactionCollection = collection(this.db, this.interactionCollectionName);
		const interactionDoc = doc(interactionCollection);
		const interactionData: CardInteraction = {
			userId,
			cardId,
			swipe
		};
		await setDoc(interactionDoc, interactionData);
	}

	private async moveCursor(country: string) {
		cursor += 1;
	}
}
