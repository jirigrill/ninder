import type { Prisma, PrismaClient } from '@prisma/client';
import type { categories } from '@prisma/client';

export async function getCategories(prisma: PrismaClient): Promise<categories[]> {
	return await prisma.categories.findMany({ where: { visible: true }, orderBy: { id: 'asc' } });
}
