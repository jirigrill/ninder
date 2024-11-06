<script lang="ts">
	import CardSwipeContainer from './components/CardSwipeContainer.svelte';

	let cards = $state(['test', '2', '3']);

	function onLike(card: string) {
		cards.shift();
	}

	function onDislike(card: string) {
		cards.shift();
	}
</script>

<CardSwipeContainer {cards} {onLike} {onDislike} />
