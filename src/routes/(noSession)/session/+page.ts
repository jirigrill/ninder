import { getStore, getUserStore } from '$lib/FirebaseStore.svelte';
import { SessionRepository } from '$lib/SessionRepository';
import type { PartnerSession } from '$lib/types';
import type { PageLoad } from './$types';

function getRandomNumberArray(): string[] {
	return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10).toString());
}

function throwIfInvalidUser(userStore) {
	if (!userStore.user) {
		throw 'user is not valid';
	}
}

async function createNewSession(userStore, repo) {
	let session = {
		initiatorUserId: userStore.user.uid,
		partnerUserId: null,
		pairingCode: getRandomNumberArray().join('')
	};

	await repo.insert(session);
	return session;
}

function isSessionUnpaired(session) {
	return !session;
}

async function resetSession(userStore, repo) {
	await repo.resetAllSessions(userStore.user.uid);
	return null;
}

async function loadPartnerSession(): Promise<PartnerSession> {
	const userStore = getUserStore();
	throwIfInvalidUser(userStore);

	const repo: SessionRepository = new SessionRepository(getStore());

	let session = await repo.getCurrentSession(userStore.user.uid);
	if (isSessionUnpaired(session)) {
		session = await resetSession(userStore, repo);
	}
	if (!session) {
		session = await createNewSession(userStore, repo);
	}

	return session;
}

export const load: PageLoad = async ({ params }) => {
	return {
		partnerSession: loadPartnerSession
	};
};
