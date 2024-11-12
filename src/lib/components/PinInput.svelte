<script lang="ts">
	import { PinInput } from 'bits-ui';
	let {
		value,
		readonly,
		onPinInput
	}: {
		value: string[];
		readonly: boolean;
		onPinInput: ((value: string) => void) | undefined;
	} = $props();

	function onValueChange(value: string[] | undefined) {
		if (!value) {
			return;
		}

		if (value.length != 4) {
			return;
		}

		if (value.some((str) => str === null || str === '')) {
			return;
		}

		if (!readonly && onPinInput) {
			onPinInput(value.join(''));
		}
	}
</script>

<PinInput.Root
	{onValueChange}
	{value}
	class="flex items-center gap-2"
	type={'text'}
	placeholder="0"
>
	<PinInput.Input
		{readonly}
		class="h-input rounded-input font-alt placeholder-shown:border-border-input focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover flex w-10 select-none rounded-xl border border-foreground bg-background px-2 py-3 text-center text-[17px] tracking-[0.01em] text-foreground"
	/>
	<PinInput.Input
		{readonly}
		class="h-input rounded-input font-alt placeholder-shown:border-border-input focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover flex w-10 select-none rounded-xl border border-foreground bg-background px-2 py-3 text-center text-[17px] tracking-[0.01em] text-foreground"
	/>
	<PinInput.Input
		{readonly}
		class="h-input rounded-input font-alt placeholder-shown:border-border-input focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover flex w-10 select-none rounded-xl border border-foreground bg-background px-2 py-3 text-center text-[17px] tracking-[0.01em] text-foreground"
	/>
	<PinInput.Input
		{readonly}
		class="h-input rounded-input font-alt placeholder-shown:border-border-input focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover flex w-10 select-none rounded-xl border border-foreground bg-background px-2 py-3 text-center text-[17px] tracking-[0.01em] text-foreground"
	/>
</PinInput.Root>
