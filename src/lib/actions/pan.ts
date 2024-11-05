import type { ActionReturn } from 'svelte/action';

export type PanEvent = {
	deltaX: number;
};

export interface Attributes {
	'on:pan': (e: CustomEvent<PanEvent>) => void;
	'on:panend': (e: CustomEvent<PanEvent>) => void;
	'on:event': (e: CustomEvent<PanEvent>) => void;
}

export function pan(node: HTMLElement): ActionReturn<Attributes> {
	let destroyHammertime = () => {};

	import('hammerjs').then(() => {
		let hammertime = new Hammer(node);

		hammertime.on('pan', (event) =>
			node.dispatchEvent(new CustomEvent<PanEvent>('pan', { detail: { deltaX: event.deltaX } }))
		);
		hammertime.on('panend', (event) =>
			node.dispatchEvent(new CustomEvent<PanEvent>('panend', { detail: { deltaX: event.deltaX } }))
		);

		destroyHammertime = () => {
			console.log('destroyed');
			hammertime.off('pan');
			hammertime.off('panend');
		};
	});
	return {
		destroy: () => {
			destroyHammertime();
		}
	};
}
