import { browser } from '$app/environment';
import { auth, login } from '$lib/FirebaseStore.svelte';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type { PageLoad } from './session/$types';

export const load: PageLoad = async () => {
	if (browser) {
		await login();
	}

	function getAuthUser(): Promise<User | null> {
		return new Promise((resolve) => {
			onAuthStateChanged(auth, (user) => {
				resolve(user);
			});
		});
	}

	return {
		getAuthUser: getAuthUser
	};
};
