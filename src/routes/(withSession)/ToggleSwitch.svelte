<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	let {
		onSexChange,
		selectedSex = $bindable()
	}: { onSexChange: (sex: 'male' | 'female' | 'all') => void; selectedSex: string } = $props();

	let previousSelectedValue: string = 'male';
	let nextState: { [id: string]: string } = {};
	nextState['male'] = 'female';
	nextState['female'] = 'all';
	nextState['all'] = 'male;';

	function onValueChange(value: string | undefined) {
		if (value === undefined) {
			selectedSex = nextState[previousSelectedValue];
		} else {
			selectedSex = value;
		}

		previousSelectedValue = selectedSex;
		onSexChange(selectedSex);
	}
</script>

<ToggleGroup.Root type="single" bind:value={selectedSex} {onValueChange}>
	<ToggleGroup.Item value="male" aria-label="Toggle male" class="m-1 h-auto w-auto p-0">
		<div
			class="rounded-xl bg-slate-200 pb-2 pl-4 pr-4 pt-2 shadow-sm"
			class:bg-white={selectedSex === 'male'}
		>
			<i class="fa-solid fa-mars text-2xl text-sky-500"></i>
		</div>
	</ToggleGroup.Item>
	<ToggleGroup.Item value="female" aria-label="Toggle female" class="m-1 h-auto w-auto p-0">
		<div
			class="rounded-xl bg-slate-200 pb-2 pl-4 pr-4 pt-2 shadow-sm"
			class:bg-white={selectedSex === 'female'}
		>
			<i class="fa-solid fa-venus text-2xl text-rose-500"></i>
		</div>
	</ToggleGroup.Item>
	<ToggleGroup.Item value="all" aria-label="Toggle all" class="m-1 h-auto w-auto p-0">
		<div
			class="rounded-xl bg-slate-200 pb-2 pl-4 pr-4 pt-2 shadow-sm"
			class:bg-white={selectedSex === 'all'}
		>
			<i
				class="fa-solid fa-venus-mars inline-block bg-gradient-to-r from-rose-500 to-sky-500 bg-clip-text text-2xl text-transparent"
			></i>
		</div>
	</ToggleGroup.Item>
</ToggleGroup.Root>
