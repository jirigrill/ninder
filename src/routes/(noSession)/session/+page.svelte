<script lang="ts">
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import QrCode from '$lib/components/QrCode.svelte';
	import PinInput from '$lib/components/PinInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { PartnerSession } from '$lib/types';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getSessionStore } from '$lib/FirebaseStore.svelte.js';

	let { data } = $props();
	const sessionStore = getSessionStore();
	let loaded = $state(false);

	data.partnerSession().then((partnerSession) => {
		loaded = true;
		sessionStore.session = partnerSession;
	});

	function getPinCodeAsArray(): string[] {
		return Array.from(sessionStore.session?.pairingCode || '');
	}

	function getPinCodeAsString(): string {
		return sessionStore.session?.pairingCode || '';
	}
</script>

<GenericTitleHeader title={'Neue Session'} />

<div class="flex flex-col items-center">
	<Tabs.Root value="create" class="w-4/5">
		<Tabs.List class="grid grid-cols-2 bg-slate-200">
			<Tabs.Trigger value="create">Erstellen</Tabs.Trigger>
			<Tabs.Trigger value="join">Beitreten</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="create" class="mb-10 mt-10">
			<Card.Root class="flex flex-col items-center">
				<Card.Header>
					<Card.Title>Du erstellst die Session</Card.Title>
					<Card.Description
						>Lass deinen Code von deinem Partner einscanner oder eintippen!</Card.Description
					>
				</Card.Header>
				<Card.Content>
					{#if loaded}
						<PinInput value={getPinCodeAsArray()} readonly={true} />
						<div class="mt-4 w-full rounded-2xl bg-white p-4 shadow">
							<QrCode url={getPinCodeAsString()} />
						</div>
						<div class="item-end mt-4 flex items-center">
							<i class="fa-solid fa-circle-notch fa-spin mr-2 text-3xl"></i>
							<p class="text-base font-normal text-slate-900">Warte auf beitritt...</p>
						</div>
					{:else}
						<div class="flex w-full justify-center">
							<Skeleton class="h-[51px] w-[40px]  rounded-2xl" />
							<Skeleton class="ml-2 h-[51px] w-[40px]  rounded-2xl" />
							<Skeleton class="ml-2 h-[51px] w-[40px] gap-2 rounded-2xl" />
							<Skeleton class="ml-2 h-[51px] w-[40px] gap-2 rounded-2xl" />
						</div>
						<Skeleton class="mt-4 aspect-square h-auto w-full rounded-2xl shadow" />
						<div class="mt-4 flex items-center">
							<i class="fa-solid fa-circle-notch fa-spin mr-2 text-3xl"></i>
							<p class="text-base font-normal text-slate-900">Erstelle Session...</p>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="join" class="mb-10 mt-10">
			<Card.Root class="flex flex-col items-center">
				<Card.Header>
					<Card.Title>Du trittst einer Session bei</Card.Title>
					<Card.Description>Tippe oder Scanne den Code deines Partners ein!</Card.Description>
				</Card.Header>
				<Card.Content>
					<PinInput readonly={false} onPinInput={(e) => console.log(e)} />
					<div class="mt-4 w-full rounded-2xl bg-white p-4 shadow">
						<QrCode url={'test'} />
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
