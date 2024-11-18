<script lang="ts">
	import PinInput from '$lib/components/PinInput.svelte';
	import QrCode from '$lib/components/QrCode.svelte';
	import * as Card from '$lib/components/ui/card';
	import { getSessionStore, getStore } from '$lib/FirebaseStore.svelte';
	import { SessionRepository } from '$lib/SessionRepository';
	import CreateSessionSkeleton from './CreateSessionSkeleton.svelte';

	type Props = { onjoined: () => void };
	const { onjoined }: Props = $props();
	let partnerJoined = $state(false);

	function getPinCodeAsArray(): string[] {
		return Array.from(['1', '3', '4', '6']);
	}

	function getPinCodeAsString(): string {
		return '1234';
	}
</script>

{#if loaded}
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
			{#if partnerJoined}
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
{:else}
	<CreateSessionSkeleton />
{/if}
