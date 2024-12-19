import type { categories } from '@prisma/client';
import prisma from './PrismaContext';

type category_history = {
	user_id: string;
	first_category_id?: number | null;
	second_category_id?: number | null;
	third_category_id?: number | null;
	fourth_category_id?: number | null;
};

export async function getCategories(set: string, userId: string): Promise<categories[]> {
	if (set === 'quick') {
		return getCategoryHistory(userId);
	} else if (set === 'popular') {
		return await prisma.categories.findMany({
			where: { visible: true, set: set },
			orderBy: { id: 'asc' }
		});
	} else {
		return await prisma.categories.findMany({
			where: { visible: true, set: set },
			orderBy: { id: 'asc' }
		});
	}
}

async function getCategoryHistory(userId: string): Promise<categories[]> {
	const history = await prisma.category_history.findFirst({ where: { user_id: userId } });
	const categoryIds: number[] = [];
	if (history) {
		if (history.first_category_id) {
			categoryIds.push(history.first_category_id);
		}
		if (history.second_category_id) {
			categoryIds.push(history.second_category_id);
		}
		if (history.third_category_id) {
			categoryIds.push(history.third_category_id);
		}
		if (history.fourth_category_id) {
			categoryIds.push(history.fourth_category_id);
		}
	}

	const categories = await prisma.categories.findMany({ where: { id: { in: categoryIds } } });
	const categoryMap = new Map(categories.map((category) => [category.id, category]));
	return categoryIds.map((id) => categoryMap.get(id)).filter((category) => category !== undefined);
}

export async function pushToCategoryHistory(userId: string, categoryId: number): Promise<void> {
	const history: category_history | null = await prisma.category_history.findFirst({
		where: { user_id: userId }
	});
	if (!history) {
		await prisma.category_history.create({
			data: { user_id: userId, first_category_id: categoryId }
		});
	} else {
		updateHistory(history, categoryId);
		await prisma.category_history.updateMany({ where: { user_id: userId }, data: history });
	}
}

function updateHistory(history: category_history, category: number) {
	const categories = [
		history.first_category_id,
		history.second_category_id,
		history.third_category_id,
		history.fourth_category_id
	];

	const existingIndex = categories.indexOf(category);

	if (existingIndex !== -1) {
		categories.splice(existingIndex, 1);
	}

	categories.unshift(category);
	categories.length = 4;

	history.first_category_id = categories[0];
	history.second_category_id = categories[1];
	history.third_category_id = categories[2];
	history.fourth_category_id = categories[3];
}

export async function deleteHistory(userId: string): Promise<void> {
	await prisma.category_history.deleteMany({ where: { user_id: userId } });
}
