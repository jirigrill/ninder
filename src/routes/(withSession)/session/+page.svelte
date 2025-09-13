<script lang="ts">
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import { deleteSession, getSession } from '$lib/client/SessionClient';
	import { createMutation, useQueryClient, createQuery } from '@tanstack/svelte-query';
	import { secureAuth } from '$lib/auth-secure';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';

	const client = useQueryClient();
	const user = secureAuth.getCurrentUser();
	if (!user) {
		goto('/auth');
	}
	const userId = user.username;

	// Check if user has an active session
	const sessionQuery = createQuery({
		queryKey: ['session', userId],
		queryFn: () => getSession(userId),
		retry: false
	});

	// Redirect to session creation if no active session
	$effect(() => {
		if ($sessionQuery.data === null && !$sessionQuery.isLoading) {
			goto('/session/new');
		}
	});

	const deleteSessionMutation = createMutation({
		mutationFn: deleteSession,
		onSuccess: async () => {
			setTimeout(async () => {
				await client.invalidateQueries({ queryKey: ['session'] });
				goto('/session/new');
			}, 1000);
		}
	});

	let buttonText = $derived.by(() => {
		if ($deleteSessionMutation.isPending) {
			return m.session_is_deliting();
		} else if ($deleteSessionMutation.isSuccess) {
			return m.session_deleted();
		}
		return m.session_remove();
	});

	function handleLogout() {
		secureAuth.logout();
		goto('/auth');
	}
</script>

<GenericTitleHeader title={'Session'} />

<div class="flex h-full flex-col items-center justify-center">
	<div class="w-4/5">
		<Card.Root class="flex flex-col items-center">
			<Card.Header>
				<Card.Title>{m.session_dialog_title()}</Card.Title>
				<Card.Description>{m.session_dialog_description()}</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>
					{m.session_dialog_content()}
				</p>

				<Button
					class="mt-4 w-full bg-red-600"
					onclick={() => $deleteSessionMutation.mutate(userId)}
				>
					{#if $deleteSessionMutation.isPending}
						<i class="fa-solid fa-circle-notch fa-spin mr-2 text-2xl"></i>
					{:else if $deleteSessionMutation.isSuccess}
						<i class="fa-solid fa-check mr-2 text-2xl"></i>
					{/if}
					{buttonText}
				</Button>

				<Button
					class="mt-4 w-full bg-blue-600"
					onclick={() => goto('/session/new')}
				>
					<i class="fa-solid fa-plus mr-2"></i>
					Create or Join Session
				</Button>

				<Button
					class="mt-4 w-full bg-gray-600"
					onclick={handleLogout}
				>
					<i class="fa-solid fa-sign-out-alt mr-2"></i>
					Logout ({user?.username})
				</Button>
			</Card.Content>
		</Card.Root>
	</div>
</div>
