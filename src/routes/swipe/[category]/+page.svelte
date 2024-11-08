<script lang="ts">
	import type { Card } from '$lib/types';
	import CardSwipeContainer from './CardSwipeContainer.svelte';

	let { data } = $props();
	let cards: Card[] = $state(data.cards);
	let loadingAnimation = $state(false);

	let skip = 2;
	let take = 2;
	let country = 'fi';

	async function onLike(card: Card) {
		cards.shift();
		await fetch(`/api/cards/${card.id}/like`, { method: 'POST' });
		await tryLoadNextStack();
	}

	async function onDislike(card: Card) {
		cards.shift();
		await fetch(`/api/cards/${card.id}/dislike`, { method: 'POST' });
		await tryLoadNextStack();
	}

	async function tryLoadNextStack() {
		if (cards.length != 0) {
			return;
		}

		loadingAnimation = true;
		const response = await fetch(`/api/cards?country=${country}&skip=${skip}&take=${take}`, {
			method: 'GET'
		});
		const newStack: Card[] = await response.json();
		await new Promise(r => setTimeout(r, 2000)); 
		cards.push(...newStack);
		skip += take;
		loadingAnimation = false;
	}
</script>

{#if loadingAnimation}
	<i class="fa-solid fa-spinner loading-spinner absolute text-9xl"></i>
{/if}

<CardSwipeContainer {cards} {onLike} {onDislike} />

<style>
	.loading-spinner {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation: rotate-animation 1s infinite linear;
	}

	@keyframes rotate-animation {
		0% {
			transform: rotate(0deg);
		}
		50% {
			transform: rotate(180deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
