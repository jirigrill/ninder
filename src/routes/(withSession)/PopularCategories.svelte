<script lang="ts">
	import type { CategoryProgress } from '$lib/types';
	import { getCategories } from '$lib/client/CategoryClient';
	import { createQuery } from '@tanstack/svelte-query';
	import { getSexState } from '$lib/components/SexStore.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { search }: { search: string } = $props();

	let query = createQuery<CategoryProgress[], Error>({
		queryKey: ['categories'],
		queryFn: () => getCategories(getSexState())
	});

	function filterBySearch(categories: CategoryProgress[], search: string) {
		return categories.filter((category) =>
			m[`categories_country_${category.letterCode.toLowerCase()}`]?.()
				.toLowerCase()
				.includes(search.toLowerCase())
		);
	}
</script>

<h1 class="mb-2 text-xl font-semibold">Beliebt</h1>

<div class="grid grid-cols-2 gap-2">
	{#if $query && $query.isSuccess}
		{#each filterBySearch($query.data.slice(0, 4), search) as category}
			<a
				href="/swipe/{category.letterCode}"
				class="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-2 gap-y-1 rounded-xl bg-white p-3 shadow"
			>
				{#if category.letterCode === '[DP]'}
					<i class="fa-solid fa-heart self-center text-red-500"></i>
				{:else}
					<i class="fi self-center shadow-sm fi-{category.letterCode.toLowerCase()}"></i>
				{/if}
				<h1 class="self-center">
					{#if category.letterCode === '[DP]'}
						{m.categories_your_partner()}
					{:else}
						{m[`categories_country_${category.letterCode.toLowerCase()}`]?.()}
					{/if}
				</h1>
				<p class="col-span-2 self-end text-xs leading-none text-slate-500">
					{category.swipedCards}/{category.totalCards} Namen
				</p>
			</a>
		{/each}
	{/if}
</div>
