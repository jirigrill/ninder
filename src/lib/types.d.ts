export type Card = {
	id: string
	name: string;
	countries: string[];
	meaning: string;
	swipeStatus: "none" | "liked" | "disliked";
};
