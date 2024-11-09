import type { ActionReturn } from 'svelte/action';


const gradients = [
	['bg-gradient-to-br', 'from-sky-200', 'to-sky-400']
];

export function randombackgroundcolor(node: HTMLElement): ActionReturn {
    setBackgroundColor(node);
	return {
		update: () => {
			setBackgroundColor(node);
		}
	};
}


function setBackgroundColor(node: HTMLElement)
{
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    node.classList.add(...randomGradient);
}