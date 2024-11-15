<script lang="ts">
	import type { Card } from '$lib/types';
	import { page } from '$app/stores';
	import CardActionBar from './CardActionBar.svelte';
	import SwipeableCardStack from '$lib/components/SwipeableCardStack.svelte';
	import TitleHeader from './TitleHeader.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import SwipeFeedback from './SwipeFeedback.svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { getCards } from '$lib/client/CardClient';

	let swipeableCardStack: SwipeableCardStack;
	let swipeFeedbackState: 'left' | 'right' | 'none' = $state('none');
	let backgroundColor = $state('bg-slate-100');
	let take = 10;
	let country = $page.params.category;

	const cardsQuery = createQuery<Card[], Error>({
		queryKey: ['cards', country, take],
		queryFn: () => getCards(country, take)
	});

	const swipeCard = async (swipeAction: {card: Card, swipeAction: 'like' | 'dislike'}): Promise<void> => {
		await new Promise((r) => setTimeout(r, 2000));
	};

	const client = useQueryClient();
	const swipeMutation = createMutation({
		mutationFn: swipeCard,
		onMutate: async (swipeAction: {card: Card, swipeAction: 'like' | 'dislike'}) => {
			await client.cancelQueries({queryKey: ['cards', country, take]});
			let previousCards = client.getQueryData<Card[]>(['cards', country, take]);

			if(previousCards) {
				client.setQueryData<Card[]>(['cards', country, take], () => [...(previousCards.filter(c => c.id != swipeAction.card.id))]);
			}

			return { previousCards }
		},
		onSettled: () => {
			client.invalidateQueries({ queryKey: ['cards', country, take] });
		}
	});

	async function onLike(card: Card) {
		$swipeMutation.mutate({ card: card, swipeAction: "like"});
	}

	async function onDislike(card: Card) {
		$swipeMutation.mutate({ card: card, swipeAction: "dislike"});
	}

	function onSwipeFeedback(feedbackType: 'left' | 'right' | 'none') {
		swipeFeedbackState = feedbackType;

		if (feedbackType == 'right') {
			backgroundColor = 'bg-emerald-400';
		} else if (feedbackType == 'left') {
			backgroundColor = 'bg-red-400';
		} else {
			backgroundColor = 'bg-slate-100';
		}
	}

	function onSwipe(swipe: 'left' | 'right') {
		if (swipe == 'left') {
			onDislike($cardsQuery.data[0]);
		} else if (swipe == 'right') {
			onLike($cardsQuery.data[0]);
		}
	}
</script>

<div
	class="flex h-full w-full flex-col items-center {backgroundColor} background-color-transition p-4"
>
	<div class="mb-4 w-full">
		<TitleHeader title="Entdecke" />
	</div>

	<SwipeFeedback {swipeFeedbackState} />

	{#if $cardsQuery.isLoading}
		<LoadingSpinner />
	{/if}
	{#if $cardsQuery.isSuccess}
		{#each $cardsQuery.data as item}
			<p>{item.name}</p>
		{/each}
	{/if}

	<SwipeableCardStack bind:this={swipeableCardStack} cards={$cardsQuery.data} {onSwipeFeedback} {onSwipe} />
	<div class="mt-4 w-full">
		<CardActionBar
			onDislikeButton={() => swipeableCardStack.swipe('left')}
			onLikeButton={() => swipeableCardStack.swipe('right')}
		/>
	</div>
</div>

<style>
	.bckground-color-transition {
		-webkit-transition: background-color 200ms linear;
		-ms-transition: background-color 200ms linear;
		transition: background-color 200ms linear;
	}
</style>
