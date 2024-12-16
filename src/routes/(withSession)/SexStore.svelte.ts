let state = $state('male');

export function getSexState() {
	return state;
}

export function setSexState(value: string) {
	state = value;
}
