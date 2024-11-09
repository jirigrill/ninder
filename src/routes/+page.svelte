<script lang="ts">
	import type { CategoryProgress } from '$lib/types';

	let categories: CategoryProgress[] = $state([]);

	async function loadCategories() {
		const response = await fetch(`/api/categories`, {
			method: 'GET'
		});
		const loadedCategories: CategoryProgress[] = await response.json();
		categories.push(...loadedCategories);
	}
</script>
<div class="flex justify-center w-full mb-4">
	<h1 class="text-3xl font-semibold mt-4">Länder</h1>
</div>
<div class="scroll-view h-full w-full bg-slate-100 pl-4 pr-4 pb-4">
	{#await loadCategories()}
		{#each Array(10) as index}
			{@render skeletonSnippet()}
		{/each}
	{:then}
		{#each categories as category}
			{@render categorySnippet(category)}
		{/each}
	{/await}

	{#snippet skeletonSnippet()}
		<div class="mb-4 flex flex-col rounded-xl bg-slate-200 p-4 shadow-lg">
			<div class="flex items-center">
				<div class=" h-[50px] w-[50px] bg-slate-300 shadow-sm"></div>
				<h1 class="ml-2 bg-slate-300 text-2xl font-semibold text-slate-300">Deutschland</h1>
			</div>
			<div class="flex items-baseline">
				<p class="mt-1 bg-slate-300 text-xl text-slate-300">o von o</p>
				<div class="ml-4 h-5 grow bg-slate-300"></div>
			</div>
		</div>
	{/snippet}

	{#snippet categorySnippet(category: CategoryProgress)}
		<a
			class="mb-4 flex flex-col rounded-xl bg-white p-4 shadow-lg"
			href="/swipe/{category.letterCode}"
		>
			<div class="flex items-center">
				<span class="fi mr-1 shadow-sm fi-{category.letterCode.toLowerCase()} h-[50px] w-[50px]"
				></span>
				<h1 class="ml-2 text-2xl font-semibold">{category.name}</h1>
			</div>
			<div class="flex items-baseline">
				<p class="text-xl">{category.swipedCards} von {category.totalCards}</p>
				<progress class="ml-4 grow" value={category.swipedCards} max={category.totalCards}
				></progress>
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
