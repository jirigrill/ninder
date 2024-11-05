<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '../app.css';
	let { children } = $props();
</script>

<main class="h-screen w-screen bg-slate-50">
	{@render children()}
</main>
