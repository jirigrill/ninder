<script lang="ts">
	type Props = {
		onRevertButton: () => void;
		onDislikeButton: () => void;
		onLikeButton: () => void;
		onSuperLikeButton: () => void;
	};
	let { onRevertButton, onDislikeButton, onLikeButton, onSuperLikeButton }: Props = $props();
</script>

<div class="card-navigation flex flex-row items-center justify-center">
	<div class="mr-auto">
		{@render actionButton(
			'fa-rotate-right',
			'Revert',
			'from-sky-600',
			'to-sky-300',
			onRevertButton
		)}
	</div>
	{@render actionButton(
		'fa-circle-xmark',
		'Dislike',
		'from-red-600',
		'to-red-400',
		onDislikeButton
	)}
	{@render actionButton(
		'fa-star',
		'Super Like',
		'from-amber-500',
		'to-yellow-300',
		onSuperLikeButton
	)}
	{@render actionButton('fa-heart', 'Like', 'from-green-600', 'to-emerald-400', onLikeButton)}

	<div class="invisible ml-auto">
		{@render actionButton('fa-rotate-right', 'Hidden', 'sky-600', 'sky-300', onRevertButton)}
	</div>

	{#snippet actionButton(
		iconClass: string,
		ariaLabel: string,
		gradientStartColor: string,
		gradientEndColor: string,
		clickHandler: () => void
	)}
		<button
			class="mx-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white p-2 shadow-md active:bg-slate-100 active:shadow-inner"
			aria-label={ariaLabel}
			onclick={clickHandler}
		>
			<i
				class="fa-solid {iconClass} bg-gradient-to-tr text-4xl {gradientStartColor} {gradientEndColor} inline-block bg-clip-text text-transparent"
			></i>
		</button>
	{/snippet}
</div>
