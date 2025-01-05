import type { Session } from '$lib/types';
import prisma from './PrismaContext';

export async function getSessions(userId: string): Promise<Session[]> {
	const sessions = await prisma.sessions.findMany({
		where: { OR: [{ partneruserid: userId }, { initiatoruserid: userId }] }
	});

	return sessions.map((session) => ({
		id: session.id,
		pairingCode: session.pairingcode,
		initiatorUserId: session.initiatoruserid,
		partnerUserId: session.partneruserid
	}));
}

export async function createSession(userId: string, pairingCode: string): Promise<Session> {
	const session = await prisma.sessions.create({
		data: {
			initiatoruserid: userId,
			pairingcode: pairingCode
		}
	});

	return {
		id: session.id,
		pairingCode: session.pairingcode,
		initiatorUserId: session.initiatoruserid,
		partnerUserId: session.partneruserid
	};
}

export async function joinSession(
	partnerUserId: string,
	pairingCode: string
): Promise<Session | null> {
	const sessions = await prisma.sessions.updateMany({
		where: { pairingcode: pairingCode },
		data: { partneruserid: partnerUserId }
	});

	if (sessions.count != 1) {
		return null;
	}

	const updatedSession = await prisma.sessions.findFirst({
		where: {
			pairingcode: pairingCode
		}
	});

	return updatedSession
		? {
				id: updatedSession.id,
				pairingCode: updatedSession.pairingcode,
				initiatorUserId: updatedSession.initiatoruserid,
				partnerUserId: updatedSession.partneruserid
			}
		: null;
}

export async function deleteSession(id: number): Promise<void> {
	await prisma.sessions.deleteMany({ where: { id: id } });
}
