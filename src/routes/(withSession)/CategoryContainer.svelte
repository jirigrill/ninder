<script lang="ts">
	import type { CategoryProgress } from '$lib/types';
	import { getCategories } from '$lib/client/CategoryClient';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { getSexState } from '$lib/components/SexStore.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { pushToHistory } from '$lib/client/HistoryClient';
	import { goto } from '$app/navigation';

	let { search, category }: { search: string; category: 'quick' | 'popular' | 'countries' } =
		$props();

	const client = useQueryClient();
	let query = createQuery<CategoryProgress[], Error>({
		queryKey: ['categories', category],
		queryFn: () => getCategories(getSexState(), category)
	});

	const pushToHistoryMutation = createMutation({
		mutationFn: pushToHistory,
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: ['categories', 'quick'] });
		}
	});

	function filterBySearch(categories: CategoryProgress[], search: string) {
		return categories.filter((categoryProgress) =>
			m[`categories_country_${categoryProgress.letterCode.toLowerCase()}`]?.()
				.toLowerCase()
				.includes(search.toLowerCase())
		);
	}

	function gotoCategory(category: CategoryProgress) {
		$pushToHistoryMutation.mutate(category.id);
		goto(`/swipe/${category.letterCode}`);
	}
</script>

<div class="mb-2 flex">
	<h1 class="text-xl font-semibold">{m[`category_set_by_${category}`]?.()}</h1>
	{#if $query && ($query.isLoading || $query.isFetching)}
		<i class="fa-solid fa-circle-notch fa-spin ml-2 self-center"></i>
	{/if}
</div>

<div class="grid grid-cols-2 gap-2">
	{#if $query && $query.isSuccess}
		{#if $query.data.length === 0}
			<p class="col-span-2 ml-auto mr-auto text-xs text-slate-500">
				Bisher gibt es hier noch keine Kategorien.
			</p>
		{:else}
			{#each filterBySearch($query.data, search) as category}
				<button
					onclick={() => gotoCategory(category)}
					class="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-2 gap-y-1 rounded-xl bg-white p-3 shadow"
				>
					{#if category.letterCode === '[DP]'}
						<i class="fa-solid fa-heart self-center text-red-500"></i>
					{:else}
						<i class="fi self-center shadow-sm fi-{category.letterCode.toLowerCase()}"></i>
					{/if}
					<h1 class="self-center text-start">
						{#if category.letterCode === '[DP]'}
							{m.categories_your_partner()}
						{:else}
							{m[`categories_country_${category.letterCode.toLowerCase()}`]?.()}
						{/if}
					</h1>
					<p class="col-span-2 self-end text-start text-xs leading-none text-slate-500">
						{category.swipedCards}/{category.totalCards} Namen
					</p>
				</button>
			{/each}
		{/if}
	{/if}
	{#if $query && $query.isLoading}
		{#each Array(4) as _}
			<div
				class="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-2 gap-y-1 rounded-xl bg-white p-3 shadow"
			>
				<Skeleton class="h-[20px] w-[20px] bg-slate-100" />
				<Skeleton class=" h-[20px] bg-slate-100" />
				<Skeleton class="col-span-2 h-[15px] bg-slate-100" />
			</div>
		{/each}
	{/if}
</div>
