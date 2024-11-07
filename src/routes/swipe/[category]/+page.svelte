<script lang="ts">
	import type { Card } from '$lib/types';
	import CardSwipeContainer from './CardSwipeContainer.svelte';

	let { data } = $props();

	let cards = data.names;

	function onLike(card: Card) {
		cards.shift();
	}

	function onDislike(card: Card) {
		cards.shift();
	}
</script>


<CardSwipeContainer {cards} {onLike} {onDislike} />
