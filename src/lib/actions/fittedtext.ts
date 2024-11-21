import textfit from 'textfit';

export function fittedtext(node: HTMLElement, detectMultiLine: boolean = false) {
	textfit(node, {
		detectMultiLine: detectMultiLine,
		alignVertWithFlexbox: true,
		alignHoriz: true
	});
}
