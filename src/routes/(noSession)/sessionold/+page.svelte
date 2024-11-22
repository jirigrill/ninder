<script lang="ts">
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import JoinSession from './JoinSession.svelte';
	import CreateSession from './CreateSession.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let tabValue = $state('create');

	function onjoined() {
		setTimeout(async () => await goto('/'), 1000);
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

<GenericTitleHeader title={'Neue Session'} />

<div class="flex flex-col items-center">
	<Tabs.Root value={tabValue} class="w-4/5" onValueChange={(event) => handleTabChange(event)}>
		<Tabs.List class="grid grid-cols-2 bg-slate-200">
			<Tabs.Trigger value="create">Erstellen</Tabs.Trigger>
			<Tabs.Trigger value="join">Beitreten</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="create" class="mb-10 mt-10">
			<CreateSession {onjoined} />
		</Tabs.Content>
		<Tabs.Content value="join" class="mb-10 mt-10">
			<JoinSession {onjoined} />
		</Tabs.Content>
	</Tabs.Root>
</div>
