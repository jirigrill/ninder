<script lang="ts">
	import { fade } from 'svelte/transition';

	const { swipeFeedbackState }: { swipeFeedbackState: 'left' | 'right' | 'none' } = $props();
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
</style>
