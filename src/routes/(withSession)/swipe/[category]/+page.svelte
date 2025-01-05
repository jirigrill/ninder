<script lang="ts">
	import type { Card } from '$lib/types';
	import { page } from '$app/stores';
	import SwipeableCardStack from '$lib/components/SwipeableCardStack.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import SwipeFeedback from './SwipeFeedback.svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { getCards, swipeCard } from '$lib/client/CardClient';
	import Match from './Match.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import { getSexState } from '$lib/components/SexStore.svelte';
	import SexToggle from '$lib/components/SexToggle.svelte';

	let swipeableCardStack: SwipeableCardStack;
	let swipeFeedbackState: 'left' | 'right' | 'none' | 'top' = $state('none');
	let take = 50;
	let country = $page.params.category;

	let matchDialog: Match | null = $state(null);

	const swipeCardClient = async (swipeAction: {
		card: Card;
		swipeAction: 'like' | 'dislike' | 'superlike';
		categoryOrigin: string;
	}): Promise<void> => {
		const response = await swipeCard(swipeAction);
		if (!response) {
			return;
		}

		if (swipeAction.card.partnerInteraction) {
			return;
		}

		onMatch(swipeAction.card);
	};

	const cardsQuery = createQuery<Card[], Error>({
		queryKey: ['cards', country, take],
		queryFn: () => getCards(country, take, getSexState())
	});

	const client = useQueryClient();
	const swipeMutation = createMutation({
		mutationFn: swipeCardClient,
		onMutate: async (swipeAction: {
			card: Card;
			swipeAction: 'like' | 'dislike' | 'superlike';
			categoryOrigin: string;
		}) => {
			await client.cancelQueries({ queryKey: ['cards', country, take] });
			let previousCards = client.getQueryData<Card[]>(['cards', country, take]);

			if (previousCards) {
				let optimisticCards = previousCards.filter((c) => c.id != swipeAction.card.id);
				client.setQueryData<Card[]>(['cards', country, take], () => [...optimisticCards]);
			}

			return { previousCards };
		},
		onSuccess: async () => {
			let remainingCards = client.getQueryData<Card[]>(['cards', country, take]);
			if (remainingCards && take - remainingCards.length >= 10) {
				await client.invalidateQueries({ queryKey: ['cards', country, take] });
			}
		}
	});

	async function onSuperLike(card: Card) {
		$swipeMutation.mutate({ card: card, swipeAction: 'superlike', categoryOrigin: country });
		if (
			card.partnerInteraction?.swipe == 'superliked' ||
			card.partnerInteraction?.swipe == 'liked'
		) {
			onMatch(card);
		}
	}
	async function onLike(card: Card) {
		$swipeMutation.mutate({ card: card, swipeAction: 'like', categoryOrigin: country });
		console.log(card);
		if (card.partnerInteraction?.swipe == 'liked') {
			onMatch(card);
		}
	}

	async function onDislike(card: Card) {
		$swipeMutation.mutate({ card: card, swipeAction: 'dislike', categoryOrigin: country });
		if (card.partnerInteraction?.swipe == 'superliked') {
			onMatch(card);
		}
	}

	function onSwipeFeedback(feedbackType: 'left' | 'right' | 'none' | 'top') {
		swipeFeedbackState = feedbackType;
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

	async function onSexChange(sex: 'male' | 'female' | 'all') {
		client.setQueryData<Card[]>(['cards', country, take], () => []);
		await client.invalidateQueries({ queryKey: ['cards', country, take] });
	}
</script>

<GenericTitleHeader title={m.swipe_header()} />
<div class=" pl-4 pr-4">
	<SexToggle {onSexChange} />
</div>
<div class="relative flex h-full w-full flex-col items-center pb-4 pl-4 pr-4">
	<div class="mb-4"></div>
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
</div>
