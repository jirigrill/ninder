<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import { Button } from './ui/button';

	type Props = {
		onclick: MouseEventHandler<HTMLButtonElement>;
		status: 'none' | 'succeeded' | 'failed' | 'loading';
		text: string;
	};

	let { onclick, status, text }: Props = $props();
	let variant: 'default' | 'success' | 'error' = $derived.by(() => {
		if (status == 'succeeded') {
			return 'success';
		} else if (status == 'failed') {
			return 'error';
		}

		return 'default';
	});
</script>

<Button class="w-full" {variant} disabled={status == 'loading'} {onclick}>
	<div class="flex items-center">
		{#if status == 'loading'}
			<i class="fa-solid fa-circle-notch fa-spin mr-2 text-2xl"></i>
		{:else if status == 'succeeded'}
			<i class="fa-solid fa-check mr-2 text-2xl"></i>
		{:else if status == 'failed'}
			<i class="fa-solid fa-xmark mr-2 text-2xl"></i>
		{/if}
		<p>{text}</p>
	</div></Button
>
