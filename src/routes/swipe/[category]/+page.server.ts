import * as db from "./data";

export function load({ params }: { params: { category: string } }) {
    const filteredNames = db.getCards(params.category);
    return {
        names: filteredNames
    }
}