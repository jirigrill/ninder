export type Card = {
	id: string
	name: string;
	countries: string[];
	meaning: string;
	swipeStatus: "none" | "liked" | "disliked";
};

export type Category = {
	name: string;
	letterCode: string;
	progress: number;
};