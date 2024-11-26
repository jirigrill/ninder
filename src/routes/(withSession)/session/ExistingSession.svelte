<script>
	import { goto } from '$app/navigation';
	import { deleteSession } from '$lib/client/SessionClient';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { getUserStore } from '$lib/FirebaseStore.svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	const client = useQueryClient();
	const userId = getUserStore().user.uid;

	const deleteSessionMutation = createMutation({
		mutationFn: deleteSession,
		onSuccess: async () => {
			setTimeout(async () => await client.invalidateQueries({ queryKey: ['session'] }), 1000);
		}
	});

	let buttonText = $derived.by(() => {
		if ($deleteSessionMutation.isPending) {
			return 'Session wird aufgelöst...';
		} else if ($deleteSessionMutation.isSuccess) {
			return 'Session aufgelöst';
		}
		return 'Session auflösen';
	});
</script>

<Card.Root class="flex flex-col items-center">
	<Card.Header>
		<Card.Title>Deine Session</Card.Title>
		<Card.Description
			>Du befindest dich im Moment bereits in einer aktiven Session.</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<p>
			Wenn du dich entscheidest deine Session aufzulösen, wird dein Fortschritt und der Fortschritt
			deines Partners unwiederufbar gelöscht.
		</p>

		<Button class="mt-4 w-full bg-red-600" onclick={() => $deleteSessionMutation.mutate(userId)}>
			{#if $deleteSessionMutation.isPending}
				<i class="fa-solid fa-circle-notch fa-spin mr-2 text-2xl"></i>
			{:else if $deleteSessionMutation.isSuccess}
				<i class="fa-solid fa-check mr-2 text-2xl"></i>
			{/if}
			{buttonText}
		</Button>
	</Card.Content>
</Card.Root>
