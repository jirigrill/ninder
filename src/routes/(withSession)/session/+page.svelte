<script lang="ts">
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import JoinSession from './JoinSession.svelte';
	import CreateSession from './CreateSession.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getSession } from '$lib/client/SessionClient';
	import type { Session } from '$lib/types';
	import ExistingSession from './ExistingSession.svelte';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { getUserStore } from '$lib/FirebaseStore.svelte';

	const client = useQueryClient();
	const sessionQuery = createQuery<Session, Error>({
		queryKey: ['session'],
		queryFn: () => getSession(getUserStore().user.uid)
	});

	let tabValue = $state('create');
	let isRefetching = $state(false);

	async function onjoined() {
		isRefetching = true;
		await client.invalidateQueries({ queryKey: ['session'] });
		await client.refetchQueries({ queryKey: ['session'] });
		setTimeout(async () => {
			await goto('/'), (isRefetching = false);
		}, 1000);
	}

	function handleTabChange(value: string) {
		const query = new URLSearchParams(window.location.search);
		query.set('action', value);
		history.replaceState(null, '', `${window.location.pathname}?${query.toString()}`);
	}

	onMount(() => {
		const query = new URLSearchParams(window.location.search);
		const action = query.get('action');
		if (action === 'create' || action === 'join') {
			tabValue = action;
		}
	});
</script>

<GenericTitleHeader title={'Session'} />

<div class="flex h-full flex-col items-center justify-center">
	{#if $sessionQuery.data && $sessionQuery.data?.partnerUserId && !isRefetching}
		<div class="w-4/5">
			<ExistingSession />
		</div>
	{:else}
		<Tabs.Root value={tabValue} class="w-4/5" onValueChange={(event) => handleTabChange(event)}>
			<Tabs.List class="grid grid-cols-2 bg-slate-200">
				<Tabs.Trigger value="create">Erstellen</Tabs.Trigger>
				<Tabs.Trigger value="join">Beitreten</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="create" class="">
				<CreateSession {onjoined} />
			</Tabs.Content>
			<Tabs.Content value="join" class="">
				<JoinSession {onjoined} />
			</Tabs.Content>
		</Tabs.Root>
	{/if}
</div>
