import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	Firestore,
	getDocs,
	onSnapshot,
	query,
	QueryDocumentSnapshot,
	setDoc,
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

	async getCurrentSessionByPairingCode(
		pairingCode: string,
		userId: string
	): Promise<PartnerSession | null> {
		const sessionsRef = collection(this.db, 'sessions');
		const q = query(sessionsRef, where('partnerUserId', '==', userId));

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
		const docRef = doc(this.db, this.collectionName, data.pairingCode || '');
		await setDoc(docRef, data);
	}

	async join(pairingCode: string, userId: string): Promise<boolean> {
		const document = await this.getOpenPairingSessionDocument(pairingCode);
		if (!document) {
			return false;
		}

		console.log(document.id);

		await updateDoc(doc(this.db, this.collectionName, document.id), {
			partnerUserId: userId
		});

		return true;
	}

	async getOpenPairingSessionDocument(
		pairingCode: string
	): Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | null> {
		const sessionsRef = collection(this.db, 'sessions');
		const q = query(sessionsRef, where('pairingCode', '==', pairingCode));

		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			const doc = querySnapshot.docs[0];
			return doc;
		} else {
			return null;
		}
	}

	listenToSessionUpdate(pairingCode: string, callback: (session: PartnerSession | null) => void) {
		const document = doc(this.db, this.collectionName, pairingCode);

		const unsubscribe = onSnapshot(document, (docSnap) => {
			if (docSnap.exists()) {
				callback(docSnap.data() as PartnerSession);
			} else {
				callback(null);
			}

			return unsubscribe;
		});
	}
}
