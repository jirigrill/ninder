import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, type User, type UserCredential } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import type { PartnerSession } from './types';

const firebaseConfig = {
	apiKey: 'AIzaSyAaxvmtb8eFtmkSbQyHIvveWbHnl6STi1Q',
	authDomain: 'ninder-74387.firebaseapp.com',
	projectId: 'ninder-74387',
	storageBucket: 'ninder-74387.firebasestorage.app',
	messagingSenderId: '682243847210',
	appId: '1:682243847210:web:828e80cfcbc3cc85de7f53'
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export const auth = getAuth();

let user: User | null = $state(null);
let session: PartnerSession | null = $state(null);

export function getUserStore() {
	return {
		get user(): User | null {
			return user;
		},
		set user(value: User) {
			user = value;
		}
	};
}

export function getSessionStore() {
	return {
		get session(): PartnerSession | null {
			return session;
		},
		set session(value: PartnerSession) {
			session = value;
		}
	};
}

export async function login(): Promise<UserCredential> {
	return signInAnonymously(auth);
}

export function getStore(): Firestore {
	return firestore;
}
