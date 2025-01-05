import {
	createSession,
	deleteSession,
	getSessions,
	joinSession
} from '$lib/server/SessionRepository';
import type { Session } from '$lib/types';

export class SessionService {
	async getSessionByUserId(userId: string): Promise<Session | undefined> {
		const sessions = await getSessions(userId);
		let session = this.#findSessionByPartnerUserId(sessions, userId);

		if (session) {
			return session;
		}

		return this.#findSessionByInitiatorUserId(sessions, userId);
	}

	getPartnerUserId(userId: string, session: Session | undefined): string | null {
		if (!session) {
			return null;
		}
		return session.partnerUserId === userId ? session.initiatorUserId : session.partnerUserId;
	}

	async createOrJoinSession(newSession: Session): Promise<Session | null> {
		let isNewSession = !!newSession.initiatorUserId;

		if (isNewSession) {
			const pairingCode = this.#generatePairingCode();
			const session = await createSession(newSession.initiatorUserId, pairingCode);

			return session;
		} else {
			const session = await joinSession(newSession.partnerUserId || '', newSession.pairingCode);
			return session;
		}
	}

	async deleteSessionByUserId(userId: string): Promise<boolean> {
		const session = await this.getSessionByUserId(userId);
		if (!session) {
			return false;
		}

		await deleteSession(session.id);
		return true;
	}

	#findSessionByPartnerUserId(sessions: Session[], userId: string): Session | undefined {
		return sessions.find((session) => session.partnerUserId === userId);
	}

	#findSessionByInitiatorUserId(sessions: Session[], userId: string): Session | undefined {
		return sessions.find((session) => session.initiatorUserId === userId);
	}

	#generatePairingCode(): string {
		return Math.floor(1000 + Math.random() * 9000).toString();
	}
}
