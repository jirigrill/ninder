<script>
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<Card.Root class="flex flex-col items-center">
	<Card.Header>
		<Card.Title>Du erstellst die Session</Card.Title>
		<Card.Description
			>Lass deinen Code von deinem Partner einscanner oder eintippen!</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<div class="flex w-full justify-center">
			<Skeleton class="h-[51px] w-[40px]  rounded-2xl" />
			<Skeleton class="ml-2 h-[51px] w-[40px]  rounded-2xl" />
			<Skeleton class="ml-2 h-[51px] w-[40px] gap-2 rounded-2xl" />
			<Skeleton class="ml-2 h-[51px] w-[40px] gap-2 rounded-2xl" />
		</div>
		<Skeleton class="mt-4 aspect-square h-auto w-full rounded-2xl shadow" />
		<div class="mt-4 flex items-center">
			<i class="fa-solid fa-circle-notch fa-spin mr-2 text-3xl"></i>
			<p class="text-base font-normal text-slate-900">Erstelle Session...</p>
		</div>
	</Card.Content>
</Card.Root>
