import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, type UserCredential } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAaxvmtb8eFtmkSbQyHIvveWbHnl6STi1Q',
	authDomain: 'ninder-74387.firebaseapp.com',
	projectId: 'ninder-74387',
	storageBucket: 'ninder-74387.firebasestorage.app',
	messagingSenderId: '682243847210',
	appId: '1:682243847210:web:828e80cfcbc3cc85de7f53'
};

export function initialize(): Firestore {
	const app = initializeApp(firebaseConfig);
	return getFirestore(app);
}

export function login(): Promise<UserCredential> {
	const auth = getAuth();
	return signInAnonymously(auth);
}
