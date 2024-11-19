import type { CreateSession, JoinSession, Session } from '$lib/types';

export const getSession = async (userId: string) => {
	const response = await fetch(`/api/session?user_id=${userId}`);
	const data = await response.json();
	if(response.status === 404) {
		return null;
	}

	return data as Session;
};

export const createSession = async (userId: string) => {
	const session: CreateSession = {
		initiatorUserId: userId
	}
	const response = await fetch(`/api/session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(session)
	});
	const data = await response.json();
	return data as Session;
};

export const joinSession = async (userId: string, pairingCode: string) => {
	const session: JoinSession = {
		partnerUserId: userId,
		pairingCode: pairingCode
	}
	const response = await fetch(`/api/session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(session)
	});

	if(response.status === 404) {
		return null;
	}

	const data = await response.json();
	return data as Session;
};