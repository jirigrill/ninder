import type { PrismaClient } from '@prisma/client';

export async function getPartnerUserId(
	userId: string,
	prisma: PrismaClient
): Promise<string | null> {
	const sessions = await prisma.sessions.findMany({
		where: { OR: [{ partneruserid: userId }, { initiatoruserid: userId }] }
	});

	if (sessions.length === 0) {
		return null;
	}

	let preferredSession = sessions.find((session) => session.partneruserid === userId);

	if (!preferredSession) {
		preferredSession = sessions.find((session) => session.initiatoruserid === userId);
	}

	if (!preferredSession) {
		return null;
	}

	return preferredSession.partneruserid === userId
		? preferredSession.initiatoruserid
		: preferredSession.partneruserid;
}
