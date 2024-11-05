<script lang="ts">
	type Props = {
		onRevert: () => void;
		onDislike: () => void;
		onLike: () => void;
		onSuperLike: () => void;
	};
	let { onRevert, onDislike, onLike, onSuperLike }: Props = $props();
</script>

<div class="card-navigation flex flex-row items-center justify-center">
	<div class="mr-auto">
		{@render actionButton('fa-rotate-right', 'Revert', 'sky-600', 'sky-300', onRevert)}
	</div>
	{@render actionButton('fa-circle-xmark', 'Dislike', 'red-600', 'red-400', onDislike)}
	{@render actionButton('fa-star', 'Super Like', 'amber-500', 'yellow-300', onSuperLike)}
	{@render actionButton('fa-heart', 'Like', 'green-600', 'emerald-400', onLike)}

	<div class="invisible ml-auto">
		{@render actionButton('fa-rotate-right', 'Hidden', 'sky-600', 'sky-300', onRevert)}
	</div>

	{#snippet actionButton(
		iconClass: string,
		ariaLabel: string,
		gradientStartColor: string,
		gradientEndColor: string,
		clickHandler: () => void
	)}
		<button
			class="mx-2 rounded-full bg-white p-2 shadow-md active:bg-slate-100 active:shadow-inner"
			aria-label={ariaLabel}
			onclick={clickHandler}
		>
			<i
				class="fa-solid {iconClass} inline-block bg-gradient-to-tr from-{gradientStartColor} to-{gradientEndColor} bg-clip-text text-4xl text-transparent"
			></i>
		</button>
	{/snippet}
</div>
