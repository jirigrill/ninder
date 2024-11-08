export type Card = {
	id: string;
	name: string;
	countries: string[];
	meaning: string;
	swipeStatus: "none" | "liked" | "disliked";
};

export type CategoryProgress = {
	name: string;
	letterCode: string;
	totalCards: number;
	swipedCards: number;
}

export type Category = {
	name: string;
	letterCode: string;
	progress: number;
};
