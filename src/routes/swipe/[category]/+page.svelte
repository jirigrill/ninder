<script lang="ts">
	import type { Card } from '$lib/types';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import CardActionBar from './CardActionBar.svelte';
	import SwipeableCardStack from '$lib/components/SwipeableCardStack.svelte';
	import TitleHeader from '$lib/components/TitleHeader.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import SwipeFeedback from './SwipeFeedback.svelte';

	let swipeableCardStack: SwipeableCardStack;
	let cards: Card[] = $state([]);
	let loadingAnimation = $state(true);
	let swipeFeedbackState: 'left' | 'right' | 'none' = $state('none');
	let backgroundColor = $state('bg-slate-100');

	let take = 10;
	let country = $page.params.category;

	if (browser) {
		tryLoadNextStack(take);
	}

	async function onLike(card: Card) {
		cards.shift();
		await fetch(`/api/cards/${card.id}/like`, { method: 'POST' });
		await tryLoadNextStack(take);
	}

	async function onDislike(card: Card) {
		cards.shift();
		await fetch(`/api/cards/${card.id}/dislike`, { method: 'POST' });
		await tryLoadNextStack(take);
	}

	async function tryLoadNextStack(take: number) {
		if (cards.length > take / 2) {
			return;
		}

		loadingAnimation = true;
		const response = await fetch(`/api/cards?country=${country}&take=${take}`, {
			method: 'GET'
		});
		const newStack: Card[] = await response.json();

		for (let newCard of newStack) {
			if (cards.some((oldCard) => newCard.id == oldCard.id)) {
				continue;
			}

			cards.push(newCard);
		}

		loadingAnimation = false;
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
			onDislike(cards[0]);
		} else if (swipe == 'right') {
			onLike(cards[0]);
		}
	}
</script>

<div class="flex h-full w-full flex-col items-center {backgroundColor} background-color-transition p-4">
	<div class="w-full mb-4">
		<TitleHeader title="Entdecke" />
	</div>

	{#if loadingAnimation && cards.length === 0}
		<LoadingSpinner />
	{/if}

	<SwipeableCardStack bind:this={swipeableCardStack} {cards} {onSwipeFeedback} {onSwipe} />
	<SwipeFeedback {swipeFeedbackState} />
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
