// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	declare var umami: umami.umami;

	declare namespace umami {
		interface umami {
			identify(event_data: { [key: string]: any }): Promise<string> | undefined;
			track(): Promise<string> | undefined;
			track(event_name: string, event_data?: { [key: string]: any }): Promise<string> | undefined;
			track(custom_payload: { website: string; [key: string]: any }): Promise<string> | undefined;
			track(
				callback: (props: {
					hostname: string;
					language: string;
					referrer: string;
					screen: string;
					title: string;
					url: string;
					website: string;
				}) => { website: string; [key: string]: any }
			): Promise<string> | undefined;
		}
	}
}

export {};
