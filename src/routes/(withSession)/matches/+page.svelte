<script lang="ts">
	import type { Match } from '$lib/types';
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { getMatches } from '$lib/client/MatchClient';
	import { randombackgroundcolor } from '$lib/actions/randomBackgroundColor';

	const matchQuery = createQuery<Match[], Error>({
		queryKey: ['matches'],
		queryFn: getMatches
	});
</script>

<GenericTitleHeader title="Matches" />

<div class="scroll-view h-full w-full bg-slate-100 pb-4 pl-4 pr-4">
	{#if $matchQuery.isLoading}
		<p>loading</p>
	{/if}
	{#if $matchQuery.isSuccess}
		{#each $matchQuery.data as match}
			{@render matchSnippet(match)}
		{/each}
	{/if}
</div>

{#snippet matchSnippet(match: Match)}
	<div use:randombackgroundcolor={match.cardId} class="mb-4 rounded-xl bg-white p-4 shadow-lg flex">
		<div
		class="flex items-center justify-center rounded-full bg-white p-2 h-full self-center mr-4"
	>
		<i
			class="fa-solid fa-heart inline-block bg-gradient-to-tr from-green-600 to-emerald-400 bg-clip-text text-4xl text-transparent"
		></i>
	</div>
		<div>
			<h1 class="text-4xl font-bold text-white">{match.name}</h1>
			<p class="text-2xl font-semibold text-white">Bedeutung: {match.meaning}</p>
		</div>
	</div>
{/snippet}

<style>
	.scroll-view {
		overflow-y: scroll;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.scroll-view::-webkit-scrollbar {
		display: none;
	}
</style>
