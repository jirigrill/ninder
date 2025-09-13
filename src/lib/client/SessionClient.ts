import { secureAuth } from '$lib/auth-secure';
import type { CreateSession, JoinSession, Session } from '$lib/types';

export const deleteSession = async (username: string) => {
	const response = await fetch(`/api/session?username=${username}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			...secureAuth.getAuthHeader()
		}
	});

	if (response.status === 404) {
		return { error: 'No session found to delete' };
	}

	if (response.status === 500) {
		return { error: 'Failed to delete session' };
	}

	const data = await response.json();
	return data;
};

export const getSession = async (username: string) => {
	const response = await fetch(`/api/session?username=${username}`, {
		headers: secureAuth.getAuthHeader()
	});
	const data = await response.json();
	if (response.status === 404) {
		return null;
	}

	return data as Session;
};

export const createSession = async (username: string) => {
	const session: CreateSession = {
		initiatorUserId: username
	};
	const response = await fetch(`/api/session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...secureAuth.getAuthHeader()
		},
		body: JSON.stringify(session)
	});
	const data = await response.json();
	return data as Session;
};

export const joinSession = async (username: string, pairingCode: string) => {
	const session: JoinSession = {
		partnerUserId: username,
		pairingCode: pairingCode
	};
	const response = await fetch(`/api/session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...secureAuth.getAuthHeader()
		},
		body: JSON.stringify(session)
	});

	if (response.status === 404) {
		return null;
	}

	const data = await response.json();
	return data as Session;
};
