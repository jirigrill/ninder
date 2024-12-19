let state: 'male' | 'female' | 'all' = $state('all');

export function getSexState(): 'male' | 'female' | 'all' {
	return state;
}

export function setSexState(value: 'male' | 'female' | 'all') {
	state = value;
}
