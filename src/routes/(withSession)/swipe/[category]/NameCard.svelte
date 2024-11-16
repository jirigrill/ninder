<script lang="ts">
	import { randombackgroundcolor } from '$lib/actions/randomBackgroundColor';
	import type { Card } from '$lib/types';
	const { card, shadow }: { card: Card | undefined; shadow: boolean } = $props();
	import { fittedtext } from '$lib/actions/fittedtext';
</script>

{#if card}
	<div
		use:randombackgroundcolor={card.id}
		class="flex h-full w-full flex-col items-center justify-center rounded-lg p-4"
		class:shadow-xl={shadow}
	>
		<h1 use:fittedtext class="w-full text-8xl font-bold text-white">{card.name}</h1>
		<h2 use:fittedtext class="mt-10 w-full text-3xl font-bold text-white">- {card.meaning} -</h2>
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
