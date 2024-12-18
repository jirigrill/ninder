let state = $state('all');

export function getSexState() {
	return state;
}

export function setSexState(value: string) {
	state = value;
}
