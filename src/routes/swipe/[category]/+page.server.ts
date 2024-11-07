import { names } from "./data";

export function load({ params }: { params: { category: string } }) {
    const filteredNames = names.filter((name) => name.countries.includes(params.category));
    return {
        names: filteredNames
    }
}