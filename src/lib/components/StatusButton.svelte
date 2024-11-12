<script>
	import { Button } from './ui/button';

	let { onclick, status, text } = $props();
	let variant = $derived.by(() => {
		if (status == 'succeeded') {
			return 'success';
		} else if (status == 'failed') {
			return 'error';
		}

		return 'default';
	});
</script>

<Button class="w-full" {variant} disabled={status == 'loading'}>
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
