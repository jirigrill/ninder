<script lang="ts">
	import { Button} from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Card } from '$lib/types';
	import NameCard from './NameCard.svelte';
	import AnimatedStars from '$lib/components/AnimatedStars.svelte';

	let card: Card | null = $state(null)
	let open = $state(false)

	export function showMatch(newMatch: Card) {
		card = newMatch;
		open = true;
		console.log(newMatch);
	}

	export function close() {
		card = null;
		open = false;
	}
</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content class="border-none bg-transparent shadow-none">
		<AnimatedStars />

		<Dialog.Header class="z-10">
			<Dialog.Title
				><h1
					class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-6xl font-bold text-transparent"
				>
					It's a Match!
				</h1></Dialog.Title
			>
		</Dialog.Header>

		<div class="z-10 h-[50vh] mb-4">
			<NameCard {card} shadow={true} />
		</div>

		<Dialog.Footer class="z-10">
			<Button onclick={close} class="font-bold text-xl" type="submit">Weiter Swipen</Button>
			<Button href="/matches" class="font-bold text-xl mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" type="submit">Zu den Matches</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>