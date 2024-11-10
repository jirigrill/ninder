<script lang="ts">
	let { title }: { title: string } = $props();
</script>

<div class="flex h-full w-full">
	<i
		class="fa-solid fa-sliders invisible mr-16 flex aspect-square h-full items-center justify-center rounded-xl border-[1px] border-solid border-slate-300 bg-slate-50 text-2xl text-red-500"
	></i>
	<div class="grow"></div>
	<h1 class="text-3xl font-semibold">{title}</h1>
	<div class="grow"></div>
	<i
		class="fa-solid fa-sliders mr-16 flex aspect-square h-full items-center justify-center rounded-xl border-[1px] border-solid border-slate-300 bg-slate-50 text-2xl text-red-500"
	></i>
</div>
