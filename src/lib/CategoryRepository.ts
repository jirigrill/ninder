import { Firestore, collection, getDocs } from 'firebase/firestore';
import type { Category } from './types';

export class CategoryRepository {
	private db: Firestore;
	private collectionName: string = 'categories';

	constructor(db: Firestore) {
		this.db = db;
	}

	async getCategories(): Promise<Category[]> {
		const categoryCollection = collection(this.db, this.collectionName);
		const categorySnapshot = await getDocs(categoryCollection);
		return categorySnapshot.docs.map((doc) => doc.data() as Category);
	}
}
