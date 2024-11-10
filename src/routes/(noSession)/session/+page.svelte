<script>
	import { generateqrcode } from "$lib/actions/qrcode";
	import GenericTitleHeader from "$lib/components/GenericTitleHeader.svelte";
</script>

<GenericTitleHeader title={"Neue Session"} />
<div id="placeHolder" use:generateqrcode={"hello world"}></div>