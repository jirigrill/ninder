<script lang="ts">
	import { fade } from 'svelte/transition';

	import SwipeableCardStack from '$lib/SwipeableCardStack.svelte';
	import CardActionBar from './components/CardActionBar.svelte';

	let swipeFeedbackState = $state('none');
	let backgroundColor = $state('bg-slate-100');
	let cards = $state(['1', '2', '3', '4']);

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

	function onSwipe(feedbackType: 'left' | 'right') {
		cards.shift();
		if (cards.length == 2) {
			cards.push('push 1');
			cards.push('push 2');
			cards.push('push 3');
		}
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
		<SwipeableCardStack {onSwipeFeedback} {onSwipe} {cardSnippet} {emptyCardSnippet} {cards} />
	</div>
	<CardActionBar />
</div>

{#snippet cardSnippet(text: string)}
	<div class="h-full w-full rounded-lg bg-white shadow-xl">
		<p>{text}</p>
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
