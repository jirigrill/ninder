<script lang="ts">
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import QrCode from '$lib/components/QrCode.svelte';
	import PinInput from '$lib/components/PinInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { browser } from '$app/environment';
	import { initialize, login } from '$lib/firebaseConfig';
	import { FirestoreRepository } from '$lib/FirestoreRepository';
	import type { PartnerSession } from '$lib/types';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { data } = $props();
	let loaded = $state(false);
	let partnerSession: PartnerSession | null = null;

	data.partnerSession?.then((dataPartnerSession) => {
		loaded = true;
		partnerSession = dataPartnerSession;
	});

	function getPinCodeAsArray(): string[] {
		return Array.from(partnerSession?.pairingCode || '');
	}

	function getPinCodeAsString(): string {
		return partnerSession?.pairingCode || '';
	}
</script>

<GenericTitleHeader title={'Neue Session'} />

<main class="flex w-full grow flex-col items-center">
	<Tabs.Root value="create" class="w-4/5">
		<Tabs.List class="mb-10 grid w-full grid-cols-2 bg-slate-200">
			<Tabs.Trigger value="create">Erstellen</Tabs.Trigger>
			<Tabs.Trigger value="join">Beitreten</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="create">
			<Card.Root class="w-full">
				<Card.Header>
					<Card.Title>Du erstellst die Session</Card.Title>
					<Card.Description
						>Lass deinen Code von deinem Partner einscanner oder eintippen!</Card.Description
					>
				</Card.Header>
				<Card.Content class="flex flex-col items-center">
					{#if loaded}
						<PinInput value={getPinCodeAsArray()} readonly={true} />
						<div class="mt-4 w-full rounded-2xl bg-white p-4 shadow">
							<QrCode url={getPinCodeAsString()} />
						</div>
					{:else}
						<div class="flex w-full justify-center">
							<Skeleton class="h-[51px] w-[40px]  rounded-2xl" />
							<Skeleton class="ml-2 h-[51px] w-[40px]  rounded-2xl" />
							<Skeleton class="ml-2 h-[51px] w-[40px] gap-2 rounded-2xl" />
							<Skeleton class="ml-2 h-[51px] w-[40px] gap-2 rounded-2xl" />
						</div>
						<Skeleton class="mt-4 aspect-square h-auto w-full rounded-2xl shadow" />
					{/if}
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="join">
			<Card.Root class="w-full">
				<Card.Header>
					<Card.Title>Du trittst einer Session bei</Card.Title>
					<Card.Description>Tippe oder Scanne den Code deines Partners ein!</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col items-center">
					<!-- <PinInput readonly={false} onPinInput={(e) => console.log(e)} /> -->
					<!-- <p>test: {pairingCode}</p> -->
					<div class="mt-4 w-full rounded-2xl bg-white p-4 shadow">
						<QrCode url={'test'} />
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</main>
