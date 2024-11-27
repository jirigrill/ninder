<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';

	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '/node_modules/flag-icons/css/flag-icons.min.css';
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { setLanguageTag } from '$lib/paraglide/runtime';
	let { children, data } = $props();
</script>

<ParaglideJS {i18n}>
	<QueryClientProvider client={data.queryClient}>
		{@render children()}
	</QueryClientProvider>
</ParaglideJS>
