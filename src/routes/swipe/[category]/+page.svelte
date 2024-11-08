<script lang="ts">
	import type { Card } from '$lib/types';
	import { page } from '$app/stores';
	const email = $page.url.searchParams.get('email');
	import CardSwipeContainer from './CardSwipeContainer.svelte';
	import { fade, fly, slide } from 'svelte/transition';

	let { data } = $props();
	let cards: Card[] = $state([]);
	let loadingAnimation = $state(true);
	let skip = 0;
	let take = 2;
	let country = $page.params.category;

	$effect(() => {
		tryLoadNextStack();
	});

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
		cards.push(...newStack);
		skip += take;
		loadingAnimation = false;
	}
</script>

<div class="w-full h-full">
	{#if loadingAnimation}
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
