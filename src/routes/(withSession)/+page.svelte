<script lang="ts">
	import { getCategories } from '$lib/client/CategoryClient';
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import { Progress } from '$lib/components/ui/progress';
	import type { CategoryProgress } from '$lib/types';
	import { createQuery } from '@tanstack/svelte-query';

	const query = createQuery<CategoryProgress[], Error>({
		queryKey: ['categories'],
		queryFn: () => getCategories()
	});
</script>

<GenericTitleHeader title={'Länder'} />
<div class="scroll-view h-full w-full bg-slate-100 pb-4 pl-4 pr-4">
	{#if $query.isLoading}
		{#each Array(10) as index}
			{@render skeletonSnippet()}
		{/each}
	{:else if $query.isSuccess}
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
			class="mb-4 grid grid-cols-[6rem_1fr] grid-rows-[auto_auto] gap-1 rounded-xl bg-white p-4 shadow-lg"
			href="/swipe/{category.letterCode ?? 'mixed'}"
		>
			{#if category.letterCode}
				<span class="fi shadow-sm fi-{category.letterCode.toLowerCase()} h-[50px] w-[50px]"></span>
			{:else}
				<i class="fa-solid fa-dice h-[50px] w-[50px] text-4xl text-red-500"></i>
			{/if}

			<h1 class="self-center text-2xl font-semibold">{category.name}</h1>
			<p class="text-xl leading-none">{category.swipedCards}/{category.totalCards}</p>
			<Progress class="h-full w-full" value={category.swipedCards} max={category.totalCards} />
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
