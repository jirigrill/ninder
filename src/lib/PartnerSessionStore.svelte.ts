import { browser } from '$app/environment';
import type { PartnerSession } from './types';

const localStorageKey = 'PartnerSessionStore';
let valueState: PartnerSession | null = $state(getFromLocalStorage());

export function getPartnerSession(): PartnerSession | null {
	return valueState;
}

export function setPartnerSession(partnerSession: PartnerSession) {
	valueState = partnerSession;
	persistToLocalStorage(partnerSession);
}

function getFromLocalStorage(): PartnerSession | null {
	let json = localStorage.getItem(localStorageKey);
	if (!json) {
		return null;
	}

	return JSON.parse(json);
}

function persistToLocalStorage(session: PartnerSession) {
	localStorage.setItem(localStorageKey, JSON.stringify(session));
}