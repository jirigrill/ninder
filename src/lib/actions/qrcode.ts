import type { Action, ActionReturn } from 'svelte/action';
import qrcode from "qrcode-generator";


export const generateqrcode: Action<HTMLDivElement,string> = (node, data) => {
	const typeNumber = 0;
	const errorCorrectionLevel = 'L';
	let qr = qrcode(typeNumber, errorCorrectionLevel);
	qr.addData(data);
	qr.make();
	node.innerHTML = qr.createSvgTag({margin: 1, scalable: true});
}