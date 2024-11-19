<script lang="ts">
	import { getSession, createSession } from '$lib/client/SessionClient';
	import PinInput from '$lib/components/PinInput.svelte';
	import QrCode from '$lib/components/QrCode.svelte';
	import * as Card from '$lib/components/ui/card';
	import { getUserStore } from '$lib/FirebaseStore.svelte';
	import type { Session } from '$lib/types';
	import CreateSessionSkeleton from './CreateSessionSkeleton.svelte';

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
			if(joinedSession === null) throw "session is null";
			session = joinedSession;
			setTimeout(() => onjoined(), 1000);
		}
	)

	function getPinCodeAsArray(): string[] {
		return Array.from(getPinCodeAsString());
	}

	function getPinCodeAsString(): string {
		return session?.pairingCode;
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
			{#if session.partnerUserId}
				<div class="item-end mt-4 flex items-center">
					<i class="fa-solid fa-check mr-2 text-2xl text-green-600"></i>
					<p class="text-base font-normal text-green-600">Partner ist beigetreten</p>
				</div>
			{:else}
				<div class="item-end mt-4 flex items-center">
					<i class="fa-solid fa-circle-notch fa-spin mr-2 text-3xl"></i>
					<p class="text-base font-normal text-slate-900">Warte auf beitritt...</p>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
{/if}
{#if !session}
	<CreateSessionSkeleton />
{/if}
