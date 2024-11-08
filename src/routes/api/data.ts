import type { Card, Category } from "$lib/types";

const categories: Category[] = [
    {
        name: "Deutschland",
        letterCode: "DE",
        progress: 0
    },
    {
        name: "Finnland",
        letterCode: "FI",
        progress: 0
    },
    {
        name: "Frankreich",
        letterCode: "FR",
        progress: 0
    },
    {
        name: "Griechenland",
        letterCode: "GR",
        progress: 0
    },
    {
        name: "Italien",
        letterCode: "IT",
        progress: 0
    },
    {
        name: "Kanada",
        letterCode: "CA",
        progress: 0
    },
    {
        name: "Portugal",
        letterCode: "PT",
        progress: 0
    },
    {
        name: "Russland",
        letterCode: "RU",
        progress: 0
    },
    {
        name: "Schweden",
        letterCode: "SE",
        progress: 0
    },
    {
        name: "Spanien",
        letterCode: "ES",
        progress: 0
    },
    {
        name: "Ukraine",
        letterCode: "UA",
        progress: 0
    },
    {
        name: "USA",
        letterCode: "US",
        progress: 0
    },
    {
        name: "Vereinigtes Königreich",
        letterCode: "GB",
        progress: 0
    }
];
const names: Card[] = [
    {
        id: crypto.randomUUID(),
        name: 'Emma',
        countries: ['DE', 'US', 'FR'],
        meaning: 'Die Große',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Liam',
        countries: ['US', 'IE'],
        meaning: 'Entschlossener Beschützer',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Mia',
        countries: ['DE', 'US', 'SE'],
        meaning: 'Meine Geliebte',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Noah',
        countries: ['US', 'IL'],
        meaning: 'Ruhe Trost',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Sophia',
        countries: ['US', 'DE', 'GB'],
        meaning: 'Weisheit',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Benjamin',
        countries: ['US', 'DE', 'FR'],
        meaning: 'Sohn Der Rechten Hand',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Olivia',
        countries: ['US', 'GB', 'IT'],
        meaning: 'Olivenbaum',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Lucas',
        countries: ['ES', 'PT', 'US'],
        meaning: 'Licht',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Charlotte',
        countries: ['FR', 'US', 'DE'],
        meaning: 'Die Freie',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Ella',
        countries: ['DE', 'US', 'SE'],
        meaning: 'Licht',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Henry',
        countries: ['US', 'DE', 'GB'],
        meaning: 'Der Herrscher Des Hauses',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Amelia',
        countries: ['US', 'DE', 'FR'],
        meaning: 'Die Fleißige',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Alexander',
        countries: ['GB', 'RU', 'US'],
        meaning: 'Der Beschützer Der Menschheit',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Mila',
        countries: ['DE', 'US', 'RU'],
        meaning: 'Die Liebenswerte',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'James',
        countries: ['US', 'GB'],
        meaning: 'Der Übernehmer',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Evelyn',
        countries: ['US', 'DE', 'FR'],
        meaning: 'Der Vögelchen Freund',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Aiden',
        countries: ['US', 'IE'],
        meaning: 'Kleines Feuer',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Luna',
        countries: ['US', 'IT', 'ES'],
        meaning: 'Mond',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Harper',
        countries: ['US', 'CA'],
        meaning: 'Die Harfenspielerin',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Leo',
        countries: ['DE', 'US', 'FR'],
        meaning: 'Löwe',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Mika',
        countries: ['FI'],
        meaning: 'Wer ist wie Gott?',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'Aino',
        countries: ['FI'],
        meaning: 'Einzigartige',
        swipeStatus: "none"
    }
];
const cardDb = new Array<Card>(...names);
const swiped = new Set<string>();
const categoryDb = new Array<Category>(...categories);

export function getCards(country: string | null | undefined, take: number = 10) {
    let filter = cardDb.filter((card) => !swiped.has(card.id));
    if (country !== null && country !== undefined) {
        filter = filter.filter((name) => name.countries.includes(country.toLocaleUpperCase()));
    }

    return filter.slice(0, take);
}

export function getTotalCards(country: string | null | undefined): number {
    let filter = cardDb;
    if (country !== null && country !== undefined) {
        filter = filter.filter((name) => name.countries.includes(country.toLocaleUpperCase()));
    }

    return filter.length;
}

export function getTotalSwipedCards(country: string | null | undefined): number {
    let filter = cardDb;
    if (country !== null && country !== undefined) {
        filter = filter.filter((name) => name.countries.includes(country.toLocaleUpperCase()));
    }

    return filter.filter((card) => swiped.has(card.id)).length;
}

export function removeCard(id: string) {
    const index = cardDb.findIndex((card) => card.id === id);
    if (index !== -1) {
        cardDb.splice(index, 1);
    }
}

export function updateSwipeStatus(id: string, swipeStatus: "none" | "liked" | "disliked") {
    const index = cardDb.findIndex((card) => card.id === id);

    if(index === -1) {
        throw `A card with the id ${id} wasn't found!`;
    }

    swiped.add(cardDb[index].id);
}

export function addCard() {
    cardDb.push({
        id: crypto.randomUUID(),
        name: "test",
        countries: ["FI"],
        meaning: "test",
        swipeStatus: "none"
    });
}

export function getCategories() {
    return categoryDb;
}