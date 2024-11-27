<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '/node_modules/flag-icons/css/flag-icons.min.css';
	import '../../app.css';
	import { getUserStore } from '$lib/FirebaseStore.svelte';
	import { browser } from '$app/environment';
	import { getSession } from '$lib/client/SessionClient';
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { setLanguageTag, sourceLanguageTag } from '$lib/paraglide/runtime';
	let { children, data } = $props();

	let loading = $state(true);
	let hideAppBar = $state(false);
	let pathSegment = $state('categories');
	const userStore = getUserStore();

	$effect(() => {
		if (!browser) {
			return;
		}

		setUserLanguage();
		handleUserAuthentication();
	});

	function updateUserStore(user) {
		userStore.user = user;
	}

	function handleUserAuthentication() {
		data.getAuthUser().then(async (user) => {
			if (!user) {
				return;
			}

			updateUserStore(user);
			let session = await getSession(user.uid);

			if (!session || !session.partnerUserId) {
				goto('/session/new');
			}

			umami.identify({ user_id: user.uid, pairing_code: session?.pairingCode || '' });
			loading = false;
		});
	}

	onMount(() => {
		setPathSegment();
	});

	afterNavigate(() => {
		setPathSegment();
	});

	function setPathSegment() {
		const path = window.location.pathname;
		if (path === '/session/new') {
			hideAppBar = true;
		} else {
			hideAppBar = false;
		}

		const segments = path.split('/');

		if (segments.length < 2) {
			return;
		}

		pathSegment = segments[1];
		if (pathSegment === '') {
			pathSegment = 'categories';
		}
	}

	function setUserLanguage() {
		const language = navigator?.language || navigator?.userLanguage;

		const twoLetterCode = language.slice(0, 2);
		if (twoLetterCode === 'en') {
			setLanguageTag('en');
		} else {
			setLanguageTag(sourceLanguageTag);
		}
	}
</script>

{#if loading}
	<div class="flex h-full w-full flex-col items-center justify-center bg-slate-100">
		<i class="fa-solid fa-circle-notch fa-spin mr-2 text-5xl"></i>
		<p class="mt-4 text-base font-normal text-slate-900">Bitte warte einen Moment</p>
	</div>
{:else}
	<div class="flex h-full w-full flex-col bg-slate-100">
		{@render children()}
		{#if !hideAppBar}
			<div class="flex flex-row justify-between pb-2 pl-4 pr-4 pt-2">
				<a
					href="/"
					aria-label="categories"
					class="flex grow justify-center border-t-2 border-solid pt-2"
					class:border-red-700={pathSegment === 'categories'}
					class:border-slate-200={pathSegment !== 'categories'}
				>
					<i
						class="fa-solid fa-earth-americas text-3xl"
						class:text-red-700={pathSegment === 'categories'}
						class:text-slate-400={pathSegment !== 'categories'}
					></i>
				</a>
				<a
					href="/swipe/DE"
					aria-label="swipe"
					class="flex grow justify-center border-t-2 border-solid pt-2"
					class:border-red-700={pathSegment === 'swipe'}
					class:border-slate-200={pathSegment !== 'swipe'}
				>
					<i
						class="fa-solid fa-chess text-3xl"
						class:text-red-700={pathSegment === 'swipe'}
						class:text-slate-400={pathSegment !== 'swipe'}
					></i>
				</a>
				<a
					href="/matches"
					aria-label="matches"
					class="flex grow justify-center border-t-2 border-solid pt-2"
					class:border-red-700={pathSegment === 'matches'}
					class:border-slate-200={pathSegment !== 'matches'}
				>
					<i
						class="fa-solid fa-heart text-3xl"
						class:text-red-700={pathSegment === 'matches'}
						class:text-slate-400={pathSegment !== 'matches'}
					></i>
				</a>
				<a
					href="/session"
					aria-label="session"
					class="flex grow justify-center border-t-2 border-solid pt-2"
					class:border-red-700={pathSegment === 'session'}
					class:border-slate-200={pathSegment !== 'session'}
				>
					<i
						class="fa-solid fa-gear text-3xl"
						class:text-red-700={pathSegment === 'session'}
						class:text-slate-400={pathSegment !== 'session'}
					></i>
				</a>
			</div>
		{/if}
	</div>
{/if}

<style>
</style>
