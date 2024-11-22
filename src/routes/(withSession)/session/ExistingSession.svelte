<script>
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
</script>

<Card.Root class="flex flex-col items-center">
	<Card.Header>
		<Card.Title>Deine Session</Card.Title>
		<Card.Description
			>Du befindest dich im Moment bereits in einer aktiven Session.</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<p>
			Wenn du dich entscheidest deine Session aufzulösen, wird dein Fortschritt und der Fortschritt
			deines Partners unwiederufbar gelöscht.
		</p>

		<Button class="mt-4 w-full bg-red-600 text-xl" type="submit">Session auflösen</Button>
	</Card.Content>
</Card.Root>
