import admin from 'firebase-admin';
import { FIREBASE_ADMIN_CREDENTIALS } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';

if (!admin.apps.length) {
	console.log(FIREBASE_ADMIN_CREDENTIALS);
	admin.initializeApp({
		credential: admin.credential.cert(
			JSON.parse(Buffer.from(FIREBASE_ADMIN_CREDENTIALS, 'base64').toString('utf-8'))
		)
	});
}

export async function authenticate(event: RequestEvent): Promise<string | null> {
	const authHeader = event.request.headers.get('Authorization');

	if (!authHeader) {
		return null;
	}

	try {
		const idToken = authHeader.split('Bearer ')[1];
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		return decodedToken.uid;
	} catch {
		return null;
	}
}
