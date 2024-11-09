<script lang="ts">
	import type { Card } from '$lib/types';

	const { card }: { card: Card | undefined } = $props();
</script>

{#if card}
	<div
		class="flex h-full w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-sky-200 to-sky-400 shadow-xl"
	>
		<h1 class="text-8xl font-bold text-white">{card.name}</h1>
		<h2 class="mt-10 text-3xl font-bold text-white">- {card.meaning} -</h2>
		<div class="mb-5 mt-5 flex text-2xl">
			<p class="mr-5 font-bold text-white">Herkunft:</p>
			{#each card.countries as country}
				<span class="fi ml-1 mr-1 fi-{country.toLowerCase()}"></span>
			{/each}
		</div>
	</div>
{:else}
	<div
		class="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-400 bg-slate-300 p-5 shadow-xl"
	>
		<h1 class="text-center text-6xl font-bold text-slate-50">Yeah, das waren alle Namen!</h1>
		<i class="fa-solid fa-flag-checkered mt-10 text-9xl text-slate-50"></i>
	</div>
{/if}
