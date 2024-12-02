<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';

	type Props = {
		onDislikeButton: () => void;
		onLikeButton: () => void;
		onSuperLikeButton: () => void;
	};
	let { onDislikeButton, onLikeButton, onSuperLikeButton }: Props = $props();
</script>

<div class="card-navigation space-between flex w-full flex-row items-center justify-center">
	<IconButton
		onclick={onDislikeButton}
		iconClass="fa-circle-xmark"
		ariaLabel="Dislike"
		gradientStartColor="from-red-600"
		gradientEndColor="to-red-400"
		diameter="70"
	/>
	<span class="ml-4"></span>
	<IconButton
		onclick={onLikeButton}
		iconClass="fa-heart"
		ariaLabel="Like"
		gradientStartColor="from-green-600"
		gradientEndColor="to-emerald-400"
		diameter="100"
	/>
	<span class="ml-4"></span>
	<IconButton
		onclick={onSuperLikeButton}
		iconClass="fa-star"
		ariaLabel="Super Like"
		gradientStartColor="from-amber-500"
		gradientEndColor="to-yellow-300"
		diameter="70"
	/>
</div>
