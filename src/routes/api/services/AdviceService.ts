import { createAdvice, deleteAdvice, getAdvice } from '$lib/server/AdviceRepository';
import type { Advice, Session } from '$lib/types';

export class AdviceService {
	async deleteAdvivceByUserId(userId: string): Promise<void> {
		return deleteAdvice(userId);
	}

	async getAdviceByUserId(userId: string): Promise<Advice> {
		return getAdvice(userId);
	}

	async publishAdvice(session: Session): Promise<void> {
		await createAdvice(session.initiatorUserId);
		await createAdvice(session.partnerUserId || '');
	}
}
