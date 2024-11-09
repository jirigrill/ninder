<script lang="ts">
	import IconButton from "$lib/components/IconButton.svelte";

	type Props = {
		onDislikeButton: () => void;
		onLikeButton: () => void;
		// onSuperLikeButton: () => void;
	};
	let { onDislikeButton, onLikeButton }: Props = $props();
</script>

<div class="card-navigation space-between flex flex-row items-center justify-around w-full">
	<IconButton
		onclick={onDislikeButton}
		iconClass="fa-circle-xmark"
		ariaLabel="Dislike"
		gradientStartColor="from-red-600"
		gradientEndColor="to-red-400"
	/>
	<IconButton
		onclick={onLikeButton}
		iconClass="fa-heart"
		ariaLabel="Like"
		gradientStartColor="from-green-600"
		gradientEndColor="to-emerald-400"
	/>
	<IconButton
		iconClass="fa-star"
		ariaLabel="Super Like"
		gradientStartColor="from-amber-500"
		gradientEndColor="to-yellow-300"
	/>
</div>
