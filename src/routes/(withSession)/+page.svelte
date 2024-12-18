<script lang="ts">
	import { getCategories } from '$lib/client/CategoryClient';
	import GenericTitleHeader from '$lib/components/GenericTitleHeader.svelte';
	import type { CategoryProgress } from '$lib/types';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import * as m from '$lib/paraglide/messages.js';
	import SexToggle from '$lib/components/SexToggle.svelte';
	import { getSexState } from '$lib/components/SexStore.svelte';
	import QuickCategories from './QuickCategories.svelte';
	import CountryCategories from './CountryCategories.svelte';
	import PopularCategories from './PopularCategories.svelte';
	import { Input } from '$lib/components/ui/input';

	let search = $state('');
	let selectedSex = getSexState();
	const client = useQueryClient();
	let query = createQuery<CategoryProgress[], Error>({
		queryKey: ['categories'],
		queryFn: () => getCategories(selectedSex)
	});

	async function onSexChange(sex: 'male' | 'female' | 'all') {
		selectedSex = sex;
		await client.refetchQueries({ queryKey: ['categories'] });
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

	<div class="mb-4"></div>
	<QuickCategories {search} />
	<div class="mb-4"></div>
	<PopularCategories {search} />
	<div class="mb-4"></div>
	<CountryCategories {search} />
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
