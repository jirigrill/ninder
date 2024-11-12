<script lang="ts">
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getSessionStore, getStore, getUserStore } from '$lib/FirebaseStore.svelte.js';
	import JoinSession from './JoinSession.svelte';
	import CreateSession from './CreateSession.svelte';
	import CreateSessionSkeleton from './CreateSessionSkeleton.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let loaded = $state(false);
	const sessionStore = getSessionStore();

	data.partnerSession().then((partnerSession) => {
		sessionStore.session = partnerSession;
		loaded = true;
	});

	function onjoined() {
		setTimeout(async () => await goto('/'), 1000);
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
			{#if loaded}
				<CreateSession {onjoined} />
			{:else}
				<CreateSessionSkeleton />
			{/if}
		</Tabs.Content>
		<Tabs.Content value="join" class="mb-10 mt-10">
			<JoinSession {onjoined} />
		</Tabs.Content>
	</Tabs.Root>
</div>
