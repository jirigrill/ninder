<script>
	import * as Card from '$lib/components/ui/card';
	import * as m from '$lib/paraglide/messages.js';
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<Card.Root class="flex flex-col items-center">
	<Card.Header>
		<Card.Title>{m.session_new_create_cardtitle()}</Card.Title>
		<Card.Description>{m.session_new_create_carddescription()}</Card.Description>
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
			<p class="text-base font-normal text-slate-900">
				{m.session_new_create_cardstatus_creating()}
			</p>
		</div>
	</Card.Content>
</Card.Root>
