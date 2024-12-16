<script lang="ts">
	import type { Match } from '$lib/types';
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { getMatches } from '$lib/client/MatchClient';
	import { randombackgroundcolor } from '$lib/actions/randomBackgroundColor';
	import { fittedtext } from '$lib/actions/fittedtext';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import MatchDialog from './MatchDialog.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { deleteAdvices } from '$lib/client/AdviceClient';

	let matchDialog: MatchDialog | null = $state(null);
	const client = useQueryClient();

	const matchQuery = createQuery<Match[], Error>({
		queryKey: ['matches'],
		queryFn: getMatches
	});

	const deleteAdviceMutation = createMutation({
		mutationFn: deleteAdvices,
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: ['advices'] });
		}
	});
	$deleteAdviceMutation.mutate();
</script>

<GenericTitleHeader title={m.matches_title()} />

<MatchDialog bind:this={matchDialog} />

<div class="scroll-view h-full w-full bg-slate-100 pb-4 pl-4 pr-4">
	{#if $matchQuery.isLoading}
		{@render matchSkeleton()}
		{@render matchSkeleton()}
		{@render matchSkeleton()}
	{/if}
	{#if $matchQuery.isSuccess}
		{#if $matchQuery.data.length === 0}
			{@render noMatchSnippet()}
		{:else}
			{#each $matchQuery.data as match}
				{@render matchSnippet(match)}
			{/each}
		{/if}
	{/if}
</div>

{#snippet matchSnippet(match: Match)}
	<button
		onclick={() => matchDialog?.showMatch(match)}
		use:randombackgroundcolor={match.cardId}
		class="mb-3 flex w-full rounded-xl bg-white p-2 shadow-lg"
	>
		<div
			class="mr-4 flex aspect-square h-full items-center justify-center self-center rounded-full bg-white p-2"
		>
			{#if match.superMatch}
				<i
					class="fa-solid fa-star inline-block bg-gradient-to-tr from-amber-500 to-yellow-300 bg-clip-text text-4xl text-transparent"
				></i>
			{:else}
				<i
					class="fa-solid fa-heart inline-block bg-gradient-to-tr from-green-600 to-emerald-400 bg-clip-text text-4xl text-transparent"
				></i>
			{/if}
		</div>
		<h1 class="self-center text-4xl font-bold text-white">{match.name}</h1>
	</button>
{/snippet}

{#snippet matchSkeleton()}
	<div class="mb-4 flex rounded-xl bg-slate-200 p-4 shadow-lg">
		<Skeleton class="mr-4 aspect-square w-14 self-center rounded-full" />
		<div class="grow">
			<Skeleton class="mb-2 h-10 w-full rounded-lg" />
			<Skeleton class="h-8 w-full rounded-lg" />
		</div>
	</div>
{/snippet}

{#snippet noMatchSnippet()}
	<div
		class="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-400 bg-slate-300 p-5 shadow-xl"
	>
		<h1 use:fittedtext={true} class="w-full text-center text-6xl font-bold text-slate-50">
			{m.matches_no_matches()}
		</h1>
		<i class="fa-solid fa-rocket mt-10 text-9xl text-slate-50"></i>
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
