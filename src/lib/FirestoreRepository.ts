import type { FirebaseApp } from 'firebase/app';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	Firestore,
	getDocs,
	query,
	where
} from 'firebase/firestore';

export class FirestoreRepository<T> {
	private collectionName: string = 'sessions';
	private readonly db: Firestore;

	constructor(db: Firestore) {
		this.db = db;
	}

	async getCurrentSession(userId: string): Promise<T | null> {
		const sessionsRef = collection(this.db, 'sessions');
		const q = query(sessionsRef, where('initiatorUserId', '==', userId));

		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			const doc = querySnapshot.docs[0];
			return doc.data() as T;
		} else {
			return null;
		}
	}

	async resetAllSessions(userId: string): Promise<void> {
		const sessionsRef = collection(this.db, 'sessions');
		const q = query(sessionsRef, where('initiatorUserId', '==', userId));
		const querySnapshot = await getDocs(q);
		const deletePromises = querySnapshot.docs.map((docSnapshot) =>
			deleteDoc(doc(this.db, 'sessions', docSnapshot.id))
		);
		await Promise.all(deletePromises);
	}

	async insert(data: T): Promise<void> {
		const collectionReference = collection(this.db, this.collectionName);
		await addDoc(collectionReference, data);
	}
}
