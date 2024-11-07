<script lang="ts">
	import type { Card } from '$lib/types';
	import CardSwipeContainer from './components/CardSwipeContainer.svelte';

	const beliebteNamen: Card[] = [
		{
			name: 'Emma',
			land: ['DE', 'US', 'FR'],
			bedeutung: 'Die Große'
		},
		{
			name: 'Liam',
			land: ['US', 'IE'],
			bedeutung: 'Entschlossener Beschützer'
		},
		{
			name: 'Mia',
			land: ['DE', 'US', 'SE'],
			bedeutung: 'Meine Geliebte'
		},
		{
			name: 'Noah',
			land: ['US', 'IL'],
			bedeutung: 'Ruhe Trost'
		},
		{
			name: 'Sophia',
			land: ['US', 'DE', 'GB'],
			bedeutung: 'Weisheit'
		},
		{
			name: 'Benjamin',
			land: ['US', 'DE', 'FR'],
			bedeutung: 'Sohn Der Rechten Hand'
		},
		{
			name: 'Olivia',
			land: ['US', 'GB', 'IT'],
			bedeutung: 'Olivenbaum'
		},
		{
			name: 'Lucas',
			land: ['ES', 'PT', 'US'],
			bedeutung: 'Licht'
		},
		{
			name: 'Charlotte',
			land: ['FR', 'US', 'DE'],
			bedeutung: 'Die Freie'
		},
		{
			name: 'Ella',
			land: ['DE', 'US', 'SE'],
			bedeutung: 'Licht'
		},
		{
			name: 'Henry',
			land: ['US', 'DE', 'GB'],
			bedeutung: 'Der Herrscher Des Hauses'
		},
		{
			name: 'Amelia',
			land: ['US', 'DE', 'FR'],
			bedeutung: 'Die Fleißige'
		},
		{
			name: 'Alexander',
			land: ['GB', 'RU', 'US'],
			bedeutung: 'Der Beschützer Der Menschheit'
		},
		{
			name: 'Mila',
			land: ['DE', 'US', 'RU'],
			bedeutung: 'Die Liebenswerte'
		},
		{
			name: 'James',
			land: ['US', 'GB'],
			bedeutung: 'Der Übernehmer'
		},
		{
			name: 'Evelyn',
			land: ['US', 'DE', 'FR'],
			bedeutung: 'Der Vögelchen Freund'
		},
		{
			name: 'Aiden',
			land: ['US', 'IE'],
			bedeutung: 'Kleines Feuer'
		},
		{
			name: 'Luna',
			land: ['US', 'IT', 'ES'],
			bedeutung: 'Mond'
		},
		{
			name: 'Harper',
			land: ['US', 'CA'],
			bedeutung: 'Die Harfenspielerin'
		},
		{
			name: 'Leo',
			land: ['DE', 'US', 'FR'],
			bedeutung: 'Löwe'
		}
	];

	let cards = $state(beliebteNamen);

	function onLike(card: Card) {
		cards.shift();
	}

	function onDislike(card: Card) {
		cards.shift();
	}
</script>

<CardSwipeContainer {cards} {onLike} {onDislike} />
