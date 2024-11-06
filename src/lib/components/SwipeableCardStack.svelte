<script lang="ts">
	import { pan, type PanEvent } from '../actions/pan';

	type Props = {
		onSwipeFeedback: (feedbackType: 'left' | 'right' | 'none') => void;
		onSwipe: (swipe: 'left' | 'right') => void;
		cards: string[];
		cardSnippet: (card: string) => any;
		emptyCardSnippet: () => any;
	};

	const { onSwipeFeedback, onSwipe, cards, cardSnippet, emptyCardSnippet }: Props = $props();

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
		if (event.detail.deltaX > 100) {
			swipe('right');
		} else if (event.detail.deltaX < -100) {
			swipe('left');
		} else {
			transitionAnimation = true;
			resetTranslation();
			setTimeout(() => {
				resetAnimation();
			}, 500);
		}
	}

	export function swipe(direction: 'right' | 'left') {
		transitionAnimation = true;
		onSwipeFeedback(direction);

		if (direction == 'right') {
			translateRight();
		} else {
			translateLeft();
		}

		setTimeout(() => {
			resetTranslation();
			resetAnimation();
			onSwipeFeedback('none');
			onSwipe(direction);
		}, 500);
	}

	function resetTranslation() {
		translateX = 0;
	}

	function resetAnimation() {
		transitionAnimation = false;
	}

	function translateRight() {
		translateX = window.innerWidth * 1.5;
	}

	function translateLeft() {
		translateX = -(window.innerWidth * 1.5);
	}
</script>

<div class="relative h-full w-full">
	{#if cards.length <= 1}
		<div class="absolute h-full w-full">
			{@render emptyCardSnippet()}
		</div>
	{:else}
		{#key cards[1]}
			<div class="absolute h-full w-full">
				{@render cardSnippet(cards[1])}
			</div>
		{/key}
	{/if}

	{#if cards.length >= 1}
		{#key cards[0]}
			<div
				use:pan
				{onpan}
				{onpanend}
				class="absolute h-full w-full"
				class:duration-500={transitionAnimation}
				class:transition-all={transitionAnimation}
				style="transform: translateX({translateX}px) rotate({rotation}deg);"
			>
				{@render cardSnippet(cards[0])}
			</div>
		{/key}
	{/if}
</div>
