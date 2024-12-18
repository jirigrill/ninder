import type { categories } from '@prisma/client';
import prisma from './PrismaContext';

export async function getCategories(): Promise<categories[]> {
	return await prisma.categories.findMany({ where: { visible: true }, orderBy: { id: 'asc' } });
}
