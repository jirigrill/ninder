<script lang="ts">
	import PinInput from '$lib/components/PinInput.svelte';
	import StatusButton from '$lib/components/StatusButton.svelte';
	import * as Card from '$lib/components/ui/card';
	import { getUserStore } from '$lib/FirebaseStore.svelte';
	import * as m from '$lib/paraglide/messages.js';

	type Props = { onjoined: () => void };
	import { joinSession } from '$lib/client/SessionClient';
	import { onMount } from 'svelte';

	const { onjoined }: Props = $props();
	let sessionJoinState: 'none' | 'loading' | 'failed' | 'succeeded' = $state('none');
	let pinState = '';
	let pinValue: string[] = $state([]);
	const userStore = getUserStore();

	function onPinInput(pin: string) {
		pinState = pin;
		onJoinSession();
	}

	async function onJoinSession() {
		sessionJoinState = 'loading';
		const result = await joinSession(userStore.user?.uid, pinState);
		sessionJoinState = result ? 'succeeded' : 'failed';

		if (result) {
			umami.identify({ user_id: userStore.user?.uid, pairing_code: pinState });
			setTimeout(() => onjoined(), 1000);
		}
	}

	onMount(() => {
		const query = new URLSearchParams(window.location.search);
		const pairingCode = query.get('pairingCode');
		if (pairingCode) {
			pinValue = Array.from(pairingCode);
			onPinInput(pairingCode);
		}
	});
</script>

<Card.Root class="flex flex-col items-center">
	<Card.Header>
		<Card.Title>{m.session_new_join_cardtitle()}</Card.Title>
		<Card.Description>{m.session_new_join_carddescription()}</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if sessionJoinState == 'failed'}
			<p class="mb-2 text-center text-sm text-red-600">
				{m.session_new_join_cardstatus_invalidcode()}
			</p>
		{/if}
		<PinInput value={pinValue} readonly={false} {onPinInput} />
		<div class="mt-4"></div>
		<StatusButton
			onclick={async () => await onJoinSession()}
			status={sessionJoinState}
			text={m.session_new_join_button()}
		/>
	</Card.Content>
</Card.Root>
