<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getSexState, setSexState } from './SexStore.svelte';

	let { onSexChange }: { onSexChange: (sex: 'male' | 'female' | 'all') => void } = $props();

	function onClick(sex: 'male' | 'female' | 'all') {
		setSexState(sex);
		onSexChange(sex);
	}
</script>

<div class="grid w-full grid-cols-3 gap-x-2">
	<button
		class="flex grow justify-center rounded-xl bg-slate-200 p-2 shadow-sm"
		onclick={() => onClick('male')}
		class:bg-white={getSexState() === 'male'}
		aria-label="male"
	>
		<i class="fa-solid fa-mars mr-2 text-sm text-sky-500"></i>
		<p class="text-sm font-semibold">{m.sex_toggle_male()}</p>
	</button>
	<button
		class="flex grow justify-center rounded-xl bg-slate-200 p-2 shadow-sm"
		onclick={() => onClick('female')}
		class:bg-white={getSexState() === 'female'}
		aria-label="female"
	>
		<i class="fa-solid fa-venus pr-2 text-sm text-rose-500"></i>
		<p class="text-sm font-semibold">{m.sex_toggle_girls()}</p>
	</button>
	<button
		class="flex grow justify-center rounded-xl bg-slate-200 p-2 shadow-sm"
		onclick={() => onClick('all')}
		class:bg-white={getSexState() === 'all'}
		aria-label="all"
	>
		<i
			class="fa-solid fa-venus-mars inline-block bg-gradient-to-r from-rose-500 to-sky-500 bg-clip-text pr-2 text-sm text-transparent"
		></i>
		<p class="text-sm font-semibold">{m.sex_toggle_all()}</p>
	</button>
</div>
