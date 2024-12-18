<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Card, Match } from '$lib/types';
	import AnimatedStars from '$lib/components/AnimatedStars.svelte';
	import NameCard from '$lib/components/NameCard.svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { deleteMatch } from '$lib/client/MatchClient';
	import * as m from '$lib/paraglide/messages.js';

	let card: Card | null = $state(null);
	let match: Match | null = $state(null);
	let open = $state(false);

	const client = useQueryClient();

	const deleteMatchMutation = createMutation({
		mutationFn: deleteMatch,
		onSuccess: async () => {
			await client.refetchQueries({ queryKey: ['matches'] });
			close();
		}
	});

	export function showMatch(newMatch: Match) {
		card = {
			id: newMatch.cardId,
			name: newMatch.name,
			meaning: newMatch.meaning,
			countries: newMatch.countries,
			partnerInteraction: null
		};
		match = newMatch;
		open = true;
	}

	export function close() {
		card = null;
		match = null;
		open = false;
	}

	function onDeleteMatch() {
		$deleteMatchMutation.mutate(match);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="border-none bg-transparent shadow-none">
		<AnimatedStars />

		<Dialog.Header class="z-10">
			<Dialog.Title
				><h1
					class="justify-self-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent"
				>
					{#if card?.partnerInteraction?.swipe == 'superliked'}
						{m.match_super_match()}
					{:else}
						{m.match_its_match()}
					{/if}
				</h1></Dialog.Title
			>
		</Dialog.Header>

		<div class="z-10 mb-4 h-[50vh]">
			<NameCard {card} shadow={true} />
		</div>

		<Dialog.Footer class="z-10">
			<Button onclick={() => onDeleteMatch()} class="text-xl font-bold" type="submit"
				>{#if $deleteMatchMutation.isPending}
					<i class="fa-solid fa-circle-notch fa-spin mr-2 text-2xl"></i>
				{/if}
				{m.matches_remove()}
			</Button>
			<Button
				onclick={close}
				href="/matches"
				class="mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-xl font-bold"
				type="submit">{m.matches_back_to_matches()}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
