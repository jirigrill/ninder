<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	type Props = {
		ariaLabel: string;
		iconClass: string;
		gradientEndColor: string;
		gradientStartColor: string;
		diameter: string;
		onclick: MouseEventHandler<HTMLButtonElement>;
	};
	const { ariaLabel, iconClass, gradientStartColor, gradientEndColor, diameter, onclick }: Props =
		$props();
</script>

<button
	class="flex items-center justify-center rounded-full bg-white p-2 shadow-md active:bg-slate-100 active:shadow-inner"
	aria-label={ariaLabel}
	style="height: {diameter}px; width: {diameter}px"
	{onclick}
>
	<i
		class="fa-solid {iconClass} bg-gradient-to-tr text-4xl {gradientStartColor} {gradientEndColor} inline-block bg-clip-text text-transparent"
	></i>
</button>
