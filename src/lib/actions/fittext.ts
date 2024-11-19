import type { ActionReturn } from 'svelte/action';
import textFit from 'textfit';

export function fittext(node: HTMLElement): ActionReturn {
    textFit(node);

	return {};
}
