<script lang="ts">
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import * as m from '$lib/paraglide/messages.js';
	import SexToggle from '$lib/components/SexToggle.svelte';
	import { getSexState } from '$lib/components/SexStore.svelte';
	import { Input } from '$lib/components/ui/input';
	import CategoryContainer from './CategoryContainer.svelte';

	let search = $state('');
	let selectedSex = getSexState();
	const client = useQueryClient();

	async function onSexChange(sex: 'male' | 'female' | 'all') {
		selectedSex = sex;
		let quickTask = client.refetchQueries({ queryKey: ['categories', 'quick'] });
		let popularTask = client.refetchQueries({ queryKey: ['categories', 'popular'] });
		let countriesTask = client.refetchQueries({ queryKey: ['categories', 'countries'] });
		await Promise.all([quickTask, popularTask, countriesTask]);
	}
</script>

<GenericTitleHeader title={m.categories_header()} />
<div class="scroll-view h-full w-full bg-slate-100 pb-4 pl-4 pr-4">
	<SexToggle {onSexChange} />
	<div class="mb-3"></div>

	<div class="relative">
		<i
			class="fa-solid fa-magnifying-glass absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%] text-muted-foreground"
		></i>
		<Input bind:value={search} placeholder="Suche nach Kategorien..." class="pl-8" />
	</div>

	<div class="mb-8"></div>
	<CategoryContainer {search} category="quick" />
	<div class="mb-4"></div>
	<CategoryContainer {search} category="popular" />
	<div class="mb-4"></div>
	<CategoryContainer {search} category="countries" />
</div>

<style>
	.scroll-view {
		overflow-y: scroll;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.scroll-view::-webkit-scrollbar {
		display: none;
	}

	.skeleton {
		background-color: #e2e5e7 !important;
	}

	@keyframes shine {
		to {
			background-position: right -40px top 0;
		}
	}
</style>
