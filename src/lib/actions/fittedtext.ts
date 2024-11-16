import textfit from 'textfit';

export function fittedtext(node: HTMLElement) {
	textfit(node, {
		detectMultiLine: false,
		alignVertWithFlexbox: true,
		alignHoriz: true
	});
}
