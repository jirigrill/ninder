<script lang="ts">
    type Props = { onRevert: () => void, onDislike: () => void, onLike: () => void, onSuperLike: () => void};
    let { onRevert, onDislike, onLike, onSuperLike}: Props = $props();
</script>

<div class="card-navigation flex flex-row items-center justify-center">
	<button class="mx-2 mr-auto rounded-full bg-white p-2 shadow-md" aria-label="Revert" onclick={onRevert}>
		<i
			class="fa-solid fa-rotate-right inline-block bg-gradient-to-tr from-sky-600 to-sky-300 bg-clip-text text-4xl text-transparent"
		></i>
	</button>
	<button class="mx-2 rounded-full bg-white p-2 shadow-md" aria-label="Dislike" onclick={onDislike}>
		<i
			class="fa-solid fa-circle-xmark inline-block bg-gradient-to-tr from-red-600 to-red-400 bg-clip-text text-4xl text-transparent"
		></i>
	</button>
	<button class=" mx-2 rounded-full bg-white p-2 shadow-md" aria-label="Super Like" onclick={onSuperLike}>
		<i
			class="fa-solid fa-star inline-block bg-gradient-to-tr from-amber-500 to-yellow-300 bg-clip-text text-4xl text-transparent"
		></i>
	</button>
	<button class=" mx-2 rounded-full bg-white p-2 shadow-md" aria-label="Like" onclick={onLike}>
		<i
			class="fa-solid fa-heart inline-block bg-gradient-to-tr from-green-600 to-emerald-400 bg-clip-text text-4xl text-transparent"
		></i>
	</button>

	<button class="invisible mx-2 mr-auto rounded-full bg-white p-2 shadow-md" aria-label="Hidden">
		<i class="fa-solid fa-rotate-right text-4xl"></i>
	</button>
</div>
