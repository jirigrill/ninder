import { getStore, getUserStore } from '$lib/FirebaseStore.svelte';
import { SessionRepository } from '$lib/SessionRepository';
import type { PartnerSession } from '$lib/types';
import type { PageLoad } from './$types';

function getRandomNumberArray(): string[] {
	return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10).toString());
}

async function loadPartnerSession(): Promise<PartnerSession> {
	const userStore = getUserStore();

	if (!userStore.user) {
		throw 'user is not valid';
	}

	const repo: SessionRepository = new SessionRepository(getStore());

	let session = await repo.getCurrentSession(userStore.user.uid);
	if (session?.partnerUserId) {
		await repo.resetAllSessions(userStore.user.uid);
	}
	if (!session) {
		session = {
			initiatorUserId: userStore.user.uid,
			partnerUserId: null,
			pairingCode: getRandomNumberArray().join('')
		};
		await repo.insert(session);
	}

	return session;
}

export const load: PageLoad = async ({ params }) => {
	return {
		partnerSession: loadPartnerSession
	};
};
