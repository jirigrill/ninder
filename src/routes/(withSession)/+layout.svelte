<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '/node_modules/flag-icons/css/flag-icons.min.css';
	import '../../app.css';
	import { getSessionStore, getStore, getUserStore } from '$lib/FirebaseStore.svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { SessionRepository } from '$lib/SessionRepository';
	import { createQuery, QueryClientProvider, useQueryClient } from '@tanstack/svelte-query';
	import type { Session } from '$lib/types';
	import { getSession } from '$lib/client/SessionClient';
	import { error } from '@sveltejs/kit';
	let { children, data } = $props();

	let loading = $state(true);
	const userStore = getUserStore();

	const client = useQueryClient();

	let query = createQuery<Session, Error>({
		queryKey: ['session'],
		queryFn: () => getSession(),
		enabled: true
	});

	$effect(() => {
		if (!browser) {
			return;
		}

		handleUserAuthentication();
	});

	// async function gotoSessionPageIfNotPaired() {
	// 	const store = getSessionStore();

	// 	if (store.session == null) {
	// 		const repo = new SessionRepository(getStore());
	// 		const session = await repo.getPairedSession(userStore.user?.uid);
	// 		store.session = session;
	// 	}

	// 	if (store.session == null || store.session.partnerUserId == null) {
	// 		await goto('/session');
	// 	} else {
	// 		loading = false;
	// 	}
	// }

	function updateUserStore(user) {
		userStore.user = user;
	}

	function handleUserAuthentication() {
		data.getAuthUser().then(async (user) => {
			if (!user) {
				return;
			}

			updateUserStore(user);
			console.log('dd');
			await client.refetchQueries({ queryKey: ['session'] });
			// gotoSessionPageIfNotPaired();
		});
	}
</script>

a
{#if $query.isLoading}
	loading
	<div class="flex h-full w-full flex-col items-center justify-center bg-slate-100">
		<i class="fa-solid fa-circle-notch fa-spin mr-2 text-5xl"></i>
		<p class="mt-4 text-base font-normal text-slate-900">Bitte warte einen Moment</p>
	</div>
{/if}
{#if $query.isSuccess}
	success
	<div class="flex h-full w-full flex-col bg-slate-100">
		{@render children()}
		<div
			class="flex flex-row justify-between border-t-4 border-solid border-slate-200 bg-white pb-2 pl-8 pr-8 pt-2"
		>
			<a href="/" aria-label="categories">
				<i class="fa-solid fa-earth-americas text-5xl text-slate-400"></i>
			</a>
			<a href="/matches" aria-label="categories">
				<i class="fa-solid fa-hands-holding-child text-5xl text-slate-400"></i>
			</a>
		</div>
	</div>
{/if}
{#if $query.error}
	error
{/if}

<style>
</style>
