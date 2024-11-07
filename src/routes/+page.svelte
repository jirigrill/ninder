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

<a href="/swipe">Swipe</a>

{#each categories as category}
	<a class="flex" href="/swipe/{category.letterCode}">
		<span class="fi ml-1 mr-1 fi-{category.letterCode.toLowerCase()}"></span>
		<h1>{category.name}</h1>
	</a>
{/each}
