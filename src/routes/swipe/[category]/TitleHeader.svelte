<script lang="ts">
	let { title }: { title: string } = $props();
</script>

<div class="flex w-full items-baseline">
	<i
		class="fa-solid fa-sliders invisible ml-16 rounded-xl border-[1px] border-solid border-slate-300 pb-1 pl-3 pr-3 pt-2 text-3xl text-red-500"
	></i>
	<div class="grow"></div>
	<h1 class="text-3xl font-semibold">{title}</h1>
	<div class="grow"></div>
	<i
		class="fa-solid fa-sliders mr-16 rounded-xl border-[1px] border-solid border-slate-300 pb-1 pl-3 pr-3 pt-2 text-3xl bg-slate-50 text-red-500"
	></i>
</div>
