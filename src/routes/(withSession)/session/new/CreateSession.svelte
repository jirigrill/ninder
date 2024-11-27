<script lang="ts">
	import { getSession, createSession } from '$lib/client/SessionClient';
	import PinInput from '$lib/components/PinInput.svelte';
	import QrCode from '$lib/components/QrCode.svelte';
	import * as Card from '$lib/components/ui/card';
	import { getUserStore } from '$lib/FirebaseStore.svelte';
	import type { Session } from '$lib/types';
	import CreateSessionSkeleton from './CreateSessionSkeleton.svelte';
	import * as m from '$lib/paraglide/messages.js';

	type Props = { onjoined: () => void };
	import { poll } from '$lib/client/FetchPolling';
	import { onDestroy } from 'svelte';
	const { onjoined }: Props = $props();
	const userId = getUserStore().user.uid;
	let session: Session | null = $state(null);

	const { stop } = poll<Session | null>(
		fetchOrCreateSession,
		(e: Session | null) => !!e && !!e.partnerUserId,
		(joinedSession: Session | null) => {
			if (joinedSession === null) throw 'session is null';
			session = joinedSession;
			setTimeout(() => onjoined(), 1000);
		}
	);

	function getPinCodeAsArray(): string[] {
		return Array.from(session?.pairingCode);
	}

	function getJoinerUrl(): string {
		return `${window.location.origin}/session/new?action=join&pairingCode=${session?.pairingCode}`;
	}

	async function fetchOrCreateSession() {
		let existingSession = await getSession(userId);
		if (!existingSession && !session) {
			session = await createSession(userId);
			existingSession = session;
		} else if (existingSession) {
			session = existingSession;
		}
		return existingSession;
	}

	onDestroy(() => {
		stop();
	});
</script>

{#if session}
	<Card.Root class="flex flex-col items-center">
		<Card.Header>
			<Card.Title>{m.session_new_create_cardtitle()}</Card.Title>
			<Card.Description>{m.session_new_create_carddescription()}</Card.Description>
		</Card.Header>
		<Card.Content>
			<PinInput value={getPinCodeAsArray()} readonly={true} />
			<div class="mt-4 w-full rounded-2xl bg-white p-4 shadow">
				<QrCode url={getJoinerUrl()} />
			</div>
			{#if session.partnerUserId}
				<div class="item-end mt-4 flex items-center">
					<i class="fa-solid fa-check mr-2 text-2xl text-green-600"></i>
					<p class="text-base font-normal text-green-600">
						{m.session_new_create_cardstatus_joined()}
					</p>
				</div>
			{:else}
				<div class="item-end mt-4 flex items-center">
					<i class="fa-solid fa-circle-notch fa-spin mr-2 text-3xl"></i>
					<p class="text-base font-normal text-slate-900">
						{m.session_new_create_cardstatus_waiting()}
					</p>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
{/if}
{#if !session}
	<CreateSessionSkeleton />
{/if}
