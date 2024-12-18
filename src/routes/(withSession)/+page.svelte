<script lang="ts">
	import { getCategories } from '$lib/client/CategoryClient';
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import { Progress } from '$lib/components/ui/progress';
	import type { CategoryProgress } from '$lib/types';
	import { createQuery, useQueryClient, type CreateQueryResult } from '@tanstack/svelte-query';
	import * as m from '$lib/paraglide/messages.js';
	import ToggleSwitch from './ToggleSwitch.svelte';
	import { getSexState, setSexState } from './SexStore.svelte';

	let selectedSex = getSexState();
	const params = new URLSearchParams(window.location.search);
	const sex = params.get('sex');

	if (sex === 'male' || sex === 'female' || sex === 'all') {
		selectedSex = sex;
	} else if (sex === null) {
		const query = new URLSearchParams(window.location.search);
		query.set('sex', selectedSex);
		history.replaceState(null, '', `${window.location.pathname}?${query.toString()}`);
	}

	const client = useQueryClient();
	let query = createQuery<CategoryProgress[], Error>({
		queryKey: ['categories'],
		queryFn: () => getCategories(selectedSex)
	});

	async function onSexChange(sex: 'male' | 'female' | 'all') {
		selectedSex = sex;
		setSexState(selectedSex);
		const query = new URLSearchParams(window.location.search);
		query.set('sex', selectedSex);
		history.replaceState(null, '', `${window.location.pathname}?${query.toString()}`);
		await client.refetchQueries({ queryKey: ['categories'] });
	}
</script>

<GenericTitleHeader title={m.categories_header()} />
<div class="scroll-view h-full w-full bg-slate-100 pb-4 pl-4 pr-4">
	<ToggleSwitch bind:selectedSex {onSexChange} />
	<div class="mb-4"></div>
	{#if $query.isLoading || $query.isRefetching}
		{#each Array(10) as index}
			{@render skeletonSnippet()}
		{/each}
	{:else if $query && $query.isSuccess}
		{#each $query.data as category}
			{@render categorySnippet(category)}
		{/each}
	{/if}

	{#snippet skeletonSnippet()}
		<div class="mb-4 flex flex-col rounded-xl bg-slate-200 p-4 shadow-lg">
			<div class="flex items-center">
				<div class=" h-[50px] w-[50px] bg-slate-300 shadow-sm"></div>
				<h1 class="ml-2 bg-slate-300 text-2xl font-semibold text-slate-300">Deutschland</h1>
			</div>
			<div class="flex items-baseline">
				<p class="mt-1 bg-slate-300 text-xl text-slate-300">0 von 0</p>
				<div class="ml-4 h-5 grow bg-slate-300"></div>
			</div>
		</div>
	{/snippet}
	{#snippet categorySnippet(category: CategoryProgress)}
		<a
			class="mb-4 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-1 rounded-xl bg-white p-4 shadow-lg"
			href="/swipe/{category.letterCode ?? 'mixed'}?sex={selectedSex}"
		>
			{#if category.letterCode === '[DP]'}
				<i class="fa-solid fa-heart mr-2 h-[50px] w-[50px] text-4xl text-red-500"></i>
			{:else}
				<span class="fi mr-2 shadow-sm fi-{category.letterCode.toLowerCase()} h-[50px] w-[50px]"
				></span>
			{/if}

			<h1 class="self-center text-2xl font-semibold">{category.name}</h1>
			<p class="text-ml col-span-2 leading-none">
				{category.swipedCards}/{category.totalCards}
			</p>
			<div class="relative col-span-2">
				<Progress class="w-full" value={category.swipedCards} max={category.totalCards} />
			</div>
		</a>
	{/snippet}
</div>

<style>
	.scroll-view {
		overflow-y: scroll;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.scroll-view::-webkit-scrollbar {
		display: none;
	}

	.skeleton {
		background-color: #e2e5e7 !important;
	}

	@keyframes shine {
		to {
			background-position: right -40px top 0;
		}
	}
</style>
