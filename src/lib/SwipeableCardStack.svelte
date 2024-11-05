<script lang="ts">
	import { browser } from '$app/environment';

	type Props = {
		onSwipeFeedback: (feedbackType: 'left' | 'right' | 'none') => void;
		onSwipe: (swipe: 'left' | 'right') => void;
	};

	const { onSwipeFeedback, onSwipe }: Props = $props();

	let cardElement: HTMLElement;
	let translateX = $state(0);
	let rotation = $derived(translateX / 10);
	let transitionAnimation = $state(false);

	if (browser) {
		import('hammerjs').then((obj) => {
			let hammertime = new Hammer(cardElement);

			hammertime.on('pan', (event) => {
				transitionAnimation = false;
				translateX = event.deltaX;

				if (event.deltaX > 100) {
					onSwipeFeedback('right');
				} else if (event.deltaX < -100) {
					onSwipeFeedback('left');
				} else {
					onSwipeFeedback('none');
				}
			});

			hammertime.on('panend', (event) => {
				transitionAnimation = true;

				if (event.deltaX > 100) {
					translateX = 800;
					onSwipe('right');
				} else if (event.deltaX < -100) {
					translateX = -800;
					onSwipe('left');
				} else {
					translateX = 0;
				}
			});
		});
	}
</script>

<div
	bind:this={cardElement}
	class="h-full w-full rounded-lg bg-white shadow-xl"
	class:duration-150={transitionAnimation}
	class:transition-all={transitionAnimation}
	style="-webkit-transform: translateX({translateX}px) rotate({rotation}deg);"
>
	<p>test</p>
</div>
