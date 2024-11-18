<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '/node_modules/flag-icons/css/flag-icons.min.css';
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	let { children, data } = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	{@render children()}
</QueryClientProvider>

<style>
</style>
