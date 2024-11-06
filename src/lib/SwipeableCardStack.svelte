<script lang="ts">
	import { pan, type PanEvent } from './actions/pan';

	type Props = {
		onSwipeFeedback: (feedbackType: 'left' | 'right' | 'none') => void;
		onSwipe: (swipe: 'left' | 'right') => void;
	};

	const { onSwipeFeedback, onSwipe }: Props = $props();
	let cards = $state([
		1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2,
		3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4,
		5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1,
		2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3,
		4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5,
		1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2,
		3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4,
		5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1,
		2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5
	]);

	let translateX = $state(0);

	let rotation = $derived(translateX / 10);
	let transitionAnimation = $state(false);

	function onpan(event: CustomEvent<PanEvent>) {
		transitionAnimation = false;
		translateX = event.detail.deltaX;

		if (event.detail.deltaX > 100) {
			onSwipeFeedback('right');
		} else if (event.detail.deltaX < -100) {
			onSwipeFeedback('left');
		} else {
			onSwipeFeedback('none');
		}
	}

	function onpanend(event: CustomEvent<PanEvent>) {
		transitionAnimation = true;

		if (event.detail.deltaX > 100) {
			translateX = 800;
			onSwipe('right');

			setTimeout(() => {
				cards.pop();
				translateX = 0;
				transitionAnimation = false;
				onSwipeFeedback('none');
			}, 200);
		} else if (event.detail.deltaX < -100) {
			translateX = -800;
			onSwipe('left');

			setTimeout(() => {
				cards.pop();
				translateX = 0;
				transitionAnimation = false;
				onSwipeFeedback('none');
			}, 200);
		} else {
			transitionAnimation = false;
			translateX = 0;
		}
	}
</script>

<div class="relative h-full w-full">
	{#if cards.length == 1}
		<div class="absolute h-full w-full rounded-lg bg-slate-300 shadow-xl">
			<p>Keine Karten mehr vorhanden!</p>
		</div>
	{:else}
		{#key cards[cards.length - 2]}
			<div class="absolute h-full w-full rounded-lg bg-white shadow-xl">
				<p>{cards[cards.length - 2]}</p>
			</div>
		{/key}
	{/if}

	{#if cards.length >= 2}
		{#key cards[cards.length - 1]}
			<div
				use:pan
				{onpan}
				{onpanend}
				class="absolute h-full w-full rounded-lg bg-white shadow-xl"
				class:duration-200={transitionAnimation}
				class:opacity-25={transitionAnimation}
				class:transition-all={transitionAnimation}
				style="-webkit-transform: translateX({translateX}px) rotate({rotation}deg);"
			>
				<p>{cards[cards.length - 1]}</p>
			</div>
		{/key}
	{/if}
</div>
