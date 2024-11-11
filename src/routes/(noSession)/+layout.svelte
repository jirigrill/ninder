<script lang="ts">
	import '../../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { getUserStore } from '$lib/FirebaseStore.svelte';
	import { browser } from '$app/environment';

	let { children, data } = $props();
	let loading = $state(true);

	const userStore = getUserStore();

	$effect(() => {
		if (!browser) {
			return;
		}
		data.getAuthUser().then((user) => {
			if (!user) {
				return;
			}

			userStore.user = user;
			loading = false;
		});
	});
</script>

{#if loading}
	<div class="flex h-full w-full flex-col items-center justify-center bg-slate-100">
		<i class="fa-solid fa-circle-notch fa-spin mr-2 text-5xl"></i>
		<p class="mt-4 text-base font-normal text-slate-900">Bitte warte einen Moment</p>
	</div>
{:else}
	<div class="flex h-full w-full flex-col bg-slate-100">
		{@render children()}
	</div>
{/if}

<style>
</style>
