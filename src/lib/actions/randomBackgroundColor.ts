import type { ActionReturn } from 'svelte/action';

const gradients = [
	['bg-gradient-to-br', 'from-sky-200', 'to-sky-400'],
	['bg-gradient-to-br', 'from-red-200', 'to-red-400'],
	['bg-gradient-to-br', 'from-orange-200', 'to-orange-400'],
	['bg-gradient-to-br', 'from-amber-200', 'to-amber-400'],
	['bg-gradient-to-br', 'from-green-200', 'to-green-400'],
	['bg-gradient-to-br', 'from-teal-200', 'to-teal-400'],
	['bg-gradient-to-br', 'from-violet-200', 'to-violet-400']
];

export function randombackgroundcolor(node: HTMLElement, cardId: number): ActionReturn {
	setBackgroundColor(node, cardId);
	return {
		update: () => {
			setBackgroundColor(node, cardId);
		}
	};
}

function setBackgroundColor(node: HTMLElement, cardId: number) {
	const randomIndex = cardId % gradients.length;
	const randomGradient = gradients[randomIndex];
	node.classList.add(...randomGradient);
}
