<script lang="ts">
	import PinInput from '$lib/components/PinInput.svelte';
	import QrCode from '$lib/components/QrCode.svelte';
	import StatusButton from '$lib/components/StatusButton.svelte';
	import * as Card from '$lib/components/ui/card';
	import { getStore, getUserStore } from '$lib/FirebaseStore.svelte';
	import { SessionRepository } from '$lib/SessionRepository';

	type Props = { onjoined: () => void };
	const { onjoined }: Props = $props();

	let sessionJoinState: 'none' | 'loading' | 'failed' | 'succeeded' = $state('none');
	let pinState = $state('');

	const repo = new SessionRepository(getStore());
	const userStore = getUserStore();

	function onPinInput(pin: string) {
		pinState = pin;
		joinSession();
	}

	async function joinSession() {
		sessionJoinState = 'loading';
		const result = await repo.join(pinState, userStore.user?.uid);
		sessionJoinState = result ? 'succeeded' : 'failed';

		if (sessionJoinState == 'succeeded') {
			onjoined();
		}
	}
</script>

<Card.Root class="flex flex-col items-center">
	<Card.Header>
		<Card.Title>Du trittst einer Session bei</Card.Title>
		<Card.Description>Tippe oder Scanne den Code deines Partners ein!</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if sessionJoinState == 'failed'}
			<p class="mb-2 text-center text-sm text-red-600">Ungültiger Session Code</p>
		{/if}
		<PinInput readonly={false} {onPinInput} />
		<div class="mb-4 mt-4 w-full rounded-2xl bg-white p-4 shadow">
			<QrCode url={'test'} />
		</div>
		<StatusButton
			onclick={async () => await joinSession()}
			status={sessionJoinState}
			text="Session beitreten"
		/>
	</Card.Content>
</Card.Root>
