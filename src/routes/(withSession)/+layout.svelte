<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '/node_modules/flag-icons/css/flag-icons.min.css';
	import '../../app.css';
	let { children } = $props();

</script>

<div class="flex h-full w-full flex-col bg-slate-100">
	{@render children()}
	<div class="flex flex-row justify-between bg-white border-solid border-slate-200 border-t-4 pl-8 pr-8 pt-2 pb-2">
		<a href="/" aria-label="categories">
			<i
				class="fa-solid fa-earth-americas text-slate-400 text-5xl"
			></i>
		</a>
		<a href="/matches" aria-label="categories">
			<i
				class="fa-solid fa-hands-holding-child text-5xl text-slate-400"
			></i>
		</a>
	</div>
</div>

<style>
</style>