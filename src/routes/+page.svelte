<script lang="ts">
	const categories = [
    {
        name: "Deutschland",
        letterCode: "DE"
    },
    {
        name: "Finnland",
        letterCode: "FI"
    },
    {
        name: "Frankreich",
        letterCode: "FR"
    },
    {
        name: "Griechenland",
        letterCode: "GR"
    },
    {
        name: "Italien",
        letterCode: "IT"
    },
    {
        name: "Kanada",
        letterCode: "CA"
    },
    {
        name: "Portugal",
        letterCode: "PT"
    },
    {
        name: "Russland",
        letterCode: "RU"
    },
    {
        name: "Schweden",
        letterCode: "SE"
    },
    {
        name: "Spanien",
        letterCode: "ES"
    },
    {
        name: "Ukraine",
        letterCode: "UA"
    },
    {
        name: "USA",
        letterCode: "US"
    },
    {
        name: "Vereinigtes Königreich",
        letterCode: "GB"
    }
];

</script>

<div class="h-full w-full bg-slate-100 p-4 scroll-view">
	{#each categories as category}
		<a class="flex flex-col bg-white p-4 mb-4  shadow-lg rounded-xl" href="/swipe/{category.letterCode}">
			<div class="flex items-center">
				<span class="shadow-sm fi mr-1 fi-{category.letterCode.toLowerCase()} h-[50px] w-[50px]"></span>
				<h1 class="text-2xl ml-2 font-semibold">{category.name}</h1>
			</div>
			<progress class="mt-4"  value="35"></progress>
		</a>
	{/each}	
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
</style>