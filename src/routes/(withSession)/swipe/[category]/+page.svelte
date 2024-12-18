<script lang="ts">
	import type { Card } from '$lib/types';
	import { page } from '$app/stores';
	import CardActionBar from './CardActionBar.svelte';
	import SwipeableCardStack from '$lib/components/SwipeableCardStack.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import SwipeFeedback from './SwipeFeedback.svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { getCards, swipeCard } from '$lib/client/CardClient';
	import Match from './Match.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import { getSexState } from '../../SexStore.svelte';

	let swipeableCardStack: SwipeableCardStack;
	let swipeFeedbackState: 'left' | 'right' | 'none' | 'top' = $state('none');
	let backgroundColor = $state('bg-slate-100');
	let take = 50;
	let country = $page.params.category;
	const sex = getSexState();

	let matchDialog: Match | null = $state(null);

	const cardsQuery = createQuery<Card[], Error>({
		queryKey: ['cards', country, take, sex],
		queryFn: () => getCards(country, take, sex)
	});

	let isMutating = $state(false);
	const client = useQueryClient();
	const swipeMutation = createMutation({
		mutationFn: swipeCard,
		onMutate: async (swipeAction: {
			card: Card;
			swipeAction: 'like' | 'dislike' | 'superlike';
		}) => {
			isMutating = true;
			await client.cancelQueries({ queryKey: ['cards', country, take, sex] });
			let previousCards = client.getQueryData<Card[]>(['cards', country, take, sex]);

			if (previousCards) {
				let optimisticCards = previousCards.filter((c) => c.id != swipeAction.card.id);
				client.setQueryData<Card[]>(['cards', country, take, sex], () => [...optimisticCards]);
			}

			return { previousCards };
		},
		onSuccess: async () => {
			let remainingCards = client.getQueryData<Card[]>(['cards', country, take, sex]);
			if (remainingCards && take - remainingCards.length >= 10) {
				await client.invalidateQueries({ queryKey: ['cards', country, take, sex] });
			}
			isMutating = false;
		}
	});

	async function onSuperLike(card: Card) {
		$swipeMutation.mutate({ card: card, swipeAction: 'superlike' });
		if (card.partnerInteraction?.swipe == 'superliked') {
			onMatch(card);
		}
	}
	async function onLike(card: Card) {
		$swipeMutation.mutate({ card: card, swipeAction: 'like' });
		if (card.partnerInteraction?.swipe == 'liked') {
			onMatch(card);
		}
	}

	async function onDislike(card: Card) {
		$swipeMutation.mutate({ card: card, swipeAction: 'dislike' });
		if (card.partnerInteraction?.swipe == 'superliked') {
			onMatch(card);
		}
	}

	function onSwipeFeedback(feedbackType: 'left' | 'right' | 'none' | 'top') {
		swipeFeedbackState = feedbackType;

		if (feedbackType == 'right' || feedbackType == 'top') {
			backgroundColor = 'bg-emerald-400';
		} else if (feedbackType == 'left') {
			backgroundColor = 'bg-red-400';
		} else {
			backgroundColor = 'bg-slate-100';
		}
	}

	function onSwipe(swipe: 'left' | 'right' | 'top') {
		if (!$cardsQuery.data) {
			return;
		}

		if ($cardsQuery.data.length === 0) {
			return;
		}

		if (swipe === 'left') {
			onDislike($cardsQuery.data[$cardsQuery.data.length - 1]);
		} else if (swipe === 'right') {
			onLike($cardsQuery.data[$cardsQuery.data.length - 1]);
		} else if (swipe === 'top') {
			onSuperLike($cardsQuery.data[$cardsQuery.data.length - 1]);
		}
	}

	async function onMatch(card: Card) {
		matchDialog?.showMatch(card);
		await client.refetchQueries({ queryKey: ['matches'] });
		await client.refetchQueries({ queryKey: ['categories'] });
	}

	function performSwipe(direction: 'left' | 'top' | 'right') {
		if ($cardsQuery.data?.length === 0) {
			return;
		}

		if ($cardsQuery.isLoading || $cardsQuery.isFetching) {
			return;
		}

		swipeableCardStack.swipe(direction);
	}
</script>

<GenericTitleHeader title={m.swipe_header()} />
<div
	class="flex h-full w-full flex-col items-center pb-4 pl-4 pr-4 {backgroundColor} background-color-transition"
>
	<div class="mb-4 flex">
		<p class=" mr-2 font-semibold">{m.swipe_name_for()}</p>
		{#if country === '[DP]'}
			<i class="fa-solid fa-heart mr-2 text-2xl text-red-500"></i>
		{:else}
			<span class="fi mb-2 ml-1 mr-1 fi-{country.toLowerCase()}"></span>
		{/if}
		{#if sex === 'male'}
			<i class="fa-solid fa-mars text-2xl text-sky-500"></i>
		{:else if sex === 'female'}
			<i class="fa-solid fa-venus text-2xl text-rose-500"></i>
		{:else if sex === 'all'}
			<i
				class="fa-solid fa-venus-mars inline-block bg-gradient-to-r from-rose-500 to-sky-500 bg-clip-text text-2xl text-transparent"
			></i>
		{/if}
	</div>

	<SwipeFeedback {swipeFeedbackState} />

	{#if $cardsQuery.isLoading}
		<LoadingSpinner />
	{/if}

	<SwipeableCardStack
		bind:this={swipeableCardStack}
		cards={$cardsQuery.data}
		{onSwipeFeedback}
		{onSwipe}
	/>

	<Match bind:this={matchDialog} />

	<div class="mt-4 w-full">
		<CardActionBar
			onDislikeButton={() => performSwipe('left')}
			onLikeButton={() => performSwipe('right')}
			onSuperLikeButton={() => performSwipe('top')}
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
