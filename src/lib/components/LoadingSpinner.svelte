<div class="absolute z-10 flex h-full w-full items-center justify-center">
	<i class="fa-solid fa-spinner loading-spinner text-9xl"></i>
</div>

<style>
	.loading-spinner {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation: rotate-animation 1s infinite linear;
	}

	@keyframes rotate-animation {
		0% {
			transform: rotate(0deg);
		}
		50% {
			transform: rotate(180deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
