<script lang="ts">
	import { randombackgroundcolor } from '$lib/actions/randomBackgroundColor';
	import type { Card } from '$lib/types';
	const { card, shadow }: { card: Card | undefined; shadow: boolean } = $props();
	import { fittedtext } from '$lib/actions/fittedtext';
	import * as m from '$lib/paraglide/messages.js';
</script>

{#if card}
	<div
		use:randombackgroundcolor={card.id}
		class="flex h-full w-full flex-col rounded-lg"
		class:shadow-xl={shadow}
	>
		<!-- Top section with name and flags -->
		<div class="flex-shrink-0 pt-8 px-8">
			<h1 use:fittedtext class="w-full text-8xl font-bold text-white text-center">{card.name}</h1>
			<div class="mb-6 mt-5 flex flex-wrap justify-center text-4xl">
				{#each card.countries as country}
					<span class="fi mb-2 ml-1 mr-1 fi-{country.toLowerCase()}"></span>
				{/each}
			</div>
		</div>
		
		<!-- Scraped information - scrollable middle section -->
		{#if card.meaning || card.description || card.origin}
			<div class="flex-1 px-8 pb-32 overflow-y-auto">
				<div class="text-center max-w-lg mx-auto">
					{#if card.meaning}
						<p class="text-white text-lg font-semibold mb-3 leading-relaxed">{card.meaning}</p>
					{/if}
					{#if card.origin}
						<p class="text-white text-base opacity-90 italic">Origin: {card.origin}</p>
					{/if}
				</div>
			</div>
		{:else}
			<!-- Spacer when no scraped info -->
			<div class="flex-1 pb-32"></div>
		{/if}
	</div>
{:else}
	<div
		class="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-400 bg-slate-300 p-5 shadow-xl"
	>
		<h1 class="text-center text-6xl font-bold text-slate-50">{m.namecard_thats_it()}</h1>
		<i class="fa-solid fa-flag-checkered mt-10 text-9xl text-slate-50"></i>
	</div>
{/if}
