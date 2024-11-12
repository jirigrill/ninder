import json from '$lib/data/categories.json';
import type { Category } from './types';

export class CategoryRepository {
	getCategories(): Category[] {
		return json.map((element) => {
			return {
				name: element.name,
				letterCode: element.letterCode,
				totalCards: element.totalCards,
				id: Number.parseInt(element.id)
			};
		});
	}
}
