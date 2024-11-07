<script lang="ts">
	import { fade } from 'svelte/transition';

	import SwipeableCardStack from '$lib/components/SwipeableCardStack.svelte';
	import CardActionBar from './CardActionBar.svelte';
	import type { Card } from '$lib/types';

	type Props = {
		onLike: (card: Card) => void;
		onDislike: (card: Card) => void;
		cards: Card[];
	};

	let { onLike, onDislike, cards = [] }: Props = $props();

	let swipeableCardStack;
	let swipeFeedbackState = $state('none');
	let backgroundColor = $state('bg-slate-100');

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

	function onDislikeButton() {
		swipeableCardStack.swipe('left');
	}

	function onLikeButton() {
		swipeableCardStack.swipe('right');
	}
</script>

{@render swipeFeedback(
	'fa-circle-xmark',
	'from-red-600',
	'to-red-400',
	swipeFeedbackState == 'left'
)}
{@render swipeFeedback(
	'fa-heart',
	'from-green-600',
	'to-emerald-400',
	swipeFeedbackState == 'right'
)}

<div class="flex h-full w-full flex-col p-4 {backgroundColor} background-color-transition">
	<div class="mb-4 flex grow flex-col">
		<SwipeableCardStack
			bind:this={swipeableCardStack}
			{onSwipeFeedback}
			{onSwipe}
			{cardSnippet}
			{emptyCardSnippet}
			{cards}
		/>
	</div>
	<CardActionBar {onDislikeButton} {onLikeButton} />
</div>

<!-- {#snippet cardSnippet(text: string)}
	<div class="h-full w-full rounded-lg bg-white shadow-xl">
		<p>{text}</p>
	</div>
{/snippet} -->

{#snippet cardSnippet(card: Card)}
	<div
		class="flex h-full w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-sky-200 to-sky-400 shadow-xl"
	>
		<h1 class="text-8xl font-bold text-white">{card.name}</h1>
		<h2 class="mt-10 text-3xl font-bold text-white">- {card.bedeutung} -</h2>
		<div class="mb-5 mt-5 flex text-2xl">
			<p class="mr-5 font-bold text-white">Herkunft:</p>
			{#each card.land as land}
				<span class="fi ml-1 mr-1 fi-{land.toLowerCase()}"></span>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet emptyCardSnippet()}
	<div class="h-full w-full rounded-lg bg-slate-300 shadow-xl">
		<p>Keine Karten verfügbar</p>
	</div>
{/snippet}

{#snippet swipeFeedback(
	iconClass: string,
	gradientStartColor: string,
	gradientEndColor: string,
	visible: Boolean
)}
	{#if visible}
		<i
			transition:fade={{ duration: 100 }}
			class="swipe-feedback fa-solid {iconClass} bg-gradient-to-tr text-9xl {gradientStartColor} {gradientEndColor} inline-block bg-clip-text text-transparent"
		></i>
	{/if}
{/snippet}

<style>
	.swipe-feedback {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}

	.background-color-transition {
		-webkit-transition: background-color 200ms linear;
		-ms-transition: background-color 200ms linear;
		transition: background-color 200ms linear;
	}
</style>
