import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	DocumentSnapshot,
	Firestore,
	getDocs,
	query,
	QueryDocumentSnapshot,
	QuerySnapshot,
	updateDoc,
	where,
	type DocumentData
} from 'firebase/firestore';
import type { PartnerSession } from './types';

export class SessionRepository {
	private collectionName: string = 'sessions';
	private readonly db: Firestore;

	constructor(db: Firestore) {
		this.db = db;
	}

	async getCurrentSession(userId: string): Promise<PartnerSession | null> {
		const sessionsRef = collection(this.db, 'sessions');
		const q = query(sessionsRef, where('initiatorUserId', '==', userId));

		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			const doc = querySnapshot.docs[0];
			return doc.data() as PartnerSession;
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

	async insert(data: PartnerSession): Promise<void> {
		const collectionReference = collection(this.db, this.collectionName);
		await addDoc(collectionReference, data);
	}

	async join(pairingCode: string, userId: string): Promise<boolean> {
		const document = await this.getOpenPairingSessionDocument(pairingCode);
		if (!document) {
			return false;
		}

		// await updateDoc(doc(this.db, this.collectionName, document.id), {
		// 	partnerUserId: userId
		// });

		return true;
	}

	async getOpenPairingSessionDocument(
		pairingCode: string
	): Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | null> {
		const sessionsRef = collection(this.db, this.collectionName);
		const q = query(
			sessionsRef,
			where('pairingCode', '==', pairingCode),
			where('partnerUserId', '==', null)
		);

		const snapshot = await getDocs(q);
		if (snapshot.empty) {
			return null;
		}

		return snapshot.docs[0];
	}
}
