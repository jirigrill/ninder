<script lang="ts">
	import qrcode from 'qrcode-generator';

	let { url }: { url: string } = $props();
	let qrCodeContainer: HTMLElement | null = $state(null);

	function generateQrCode() {
		if (!qrCodeContainer) {
			return;
		}

		const typeNumber = 0;
		const errorCorrectionLevel = 'L';
		let qr = qrcode(typeNumber, errorCorrectionLevel);
		qr.addData(url);
		qr.make();
		qrCodeContainer.innerHTML = qr.createSvgTag({ margin: 0, scalable: true });
	}
</script>

{#if qrCodeContainer}
	{generateQrCode()}
{/if}

<div bind:this={qrCodeContainer}></div>
