import { browser } from '$app/environment';
import { initialize, login } from '$lib/firebaseConfig';
import { FirestoreRepository } from '$lib/FirestoreRepository';
import type { PartnerSession } from '$lib/types';
import type { PageLoad } from './$types';

function getRandomNumberArray(): string[] {
	return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10).toString());
}

async function loadSession(): Promise<PartnerSession> {
	const store = initialize();
	const credentials = await login();
	const repo: FirestoreRepository<PartnerSession> = new FirestoreRepository(store);

	let session = await repo.getCurrentSession(credentials.user.uid);
	if (session?.partnerUserId) {
		await repo.resetAllSessions(credentials.user.uid);
	}
	if (!session) {
		session = {
			initiatorUserId: credentials.user.uid,
			partnerUserId: null,
			pairingCode: getRandomNumberArray().join('')
		};
		await repo.insert(session);
	}

	return session;
}

export const load: PageLoad = async ({ params }) => {
	if (browser) {
		return {
			partnerSession: loadSession()
		};
	}

	return;
};
