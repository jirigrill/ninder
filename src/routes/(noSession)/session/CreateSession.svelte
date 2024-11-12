<script lang="ts">
	import PinInput from '$lib/components/PinInput.svelte';
	import QrCode from '$lib/components/QrCode.svelte';
	import * as Card from '$lib/components/ui/card';
	import { getSessionStore } from '$lib/FirebaseStore.svelte';

	type Props = { onjoined: () => void };
	const { onjoined }: Props = $props();

	const sessionStore = getSessionStore();

	function getPinCodeAsArray(): string[] {
		return Array.from(sessionStore.session?.pairingCode || '');
	}

	function getPinCodeAsString(): string {
		return sessionStore.session?.pairingCode || '';
	}
</script>

<Card.Root class="flex flex-col items-center">
	<Card.Header>
		<Card.Title>Du erstellst die Session</Card.Title>
		<Card.Description
			>Lass deinen Code von deinem Partner einscanner oder eintippen!</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<PinInput value={getPinCodeAsArray()} readonly={true} />
		<div class="mt-4 w-full rounded-2xl bg-white p-4 shadow">
			<QrCode url={getPinCodeAsString()} />
		</div>
		<div class="item-end mt-4 flex items-center">
			<i class="fa-solid fa-circle-notch fa-spin mr-2 text-3xl"></i>
			<p class="text-base font-normal text-slate-900">Warte auf beitritt...</p>
		</div>
	</Card.Content>
</Card.Root>
