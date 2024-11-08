<script lang="ts">
	import type { Card } from '$lib/types';
	import { page } from '$app/stores';
	const email = $page.url.searchParams.get('email');
	import CardSwipeContainer from './CardSwipeContainer.svelte';
	import { browser } from '$app/environment';

	let cards: Card[] = $state([]);
	let loadingAnimation = $state(true);
	let take = 10;
	let country = $page.params.category;

	if(browser) {
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
		if(cards.length > take / 2) {
			return;
		}
		
		loadingAnimation = true;
		const response = await fetch(`/api/cards?country=${country}&take=${take}`, {
			method: 'GET'
		});
		const newStack: Card[] = await response.json();

		for(let newCard of newStack) {
			if(cards.some(oldCard => newCard.id == oldCard.id)) {
				continue;
			}

			cards.push(newCard);
		}

		loadingAnimation = false;
	}
</script>

<div class="w-full h-full">
	{#if loadingAnimation && cards.length === 0}
	<div class="absolute z-10 flex justify-center items-center h-full w-full">
		<i class="fa-solid fa-spinner loading-spinner text-9xl"></i>
	</div>
{/if}

<CardSwipeContainer {cards} {onLike} {onDislike} />
</div>

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
