import type { Card } from "$lib/types";

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
    },
    {
        id: crypto.randomUUID(),
        name: 'test 1',
        countries: ['FI'],
        meaning: 'Wer ist wie Gott?',
        swipeStatus: "none"
    },
    {
        id: crypto.randomUUID(),
        name: 'test 2',
        countries: ['FI'],
        meaning: 'Einzigartige',
        swipeStatus: "none"
    }
];
const db = new Array<Card>(...names);
const swiped = new Set<string>();

export function getCards(country: string | null | undefined, skip: number = 0, take: number = 10) {
    let filter = db.filter((card) => !swiped.has(card.id));
    if (country !== null && country !== undefined) {
        filter = filter.filter((name) => name.countries.includes(country.toLocaleUpperCase()));
    }

    if(skip >= filter.length) {
        skip = 0;
    }

    return filter.slice(skip, skip + take);
}

export function removeCard(id: string) {
    const index = db.findIndex((card) => card.id === id);
    if (index !== -1) {
        db.splice(index, 1);
    }
}

export function updateSwipeStatus(id: string, swipeStatus: "none" | "liked" | "disliked") {
    const index = db.findIndex((card) => card.id === id);

    if(index === -1) {
        throw `A card with the id ${id} wasn't found!`;
    }

    swiped.add(db[index].id);
}

export function addCard() {
    db.push({
        id: crypto.randomUUID(),
        name: "test",
        countries: ["FI"],
        meaning: "test",
        swipeStatus: "none"
    });
}