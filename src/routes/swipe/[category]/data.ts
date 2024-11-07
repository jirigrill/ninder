import type { Card } from "$lib/types";

const names: Card[] = [
    {
        id: crypto.randomUUID(),
        name: 'Emma',
        countries: ['DE', 'US', 'FR'],
        meaning: 'Die Große'
    },
    {
        id: crypto.randomUUID(),
        name: 'Liam',
        countries: ['US', 'IE'],
        meaning: 'Entschlossener Beschützer'
    },
    {
        id: crypto.randomUUID(),
        name: 'Mia',
        countries: ['DE', 'US', 'SE'],
        meaning: 'Meine Geliebte'
    },
    {
        id: crypto.randomUUID(),
        name: 'Noah',
        countries: ['US', 'IL'],
        meaning: 'Ruhe Trost'
    },
    {
        id: crypto.randomUUID(),
        name: 'Sophia',
        countries: ['US', 'DE', 'GB'],
        meaning: 'Weisheit'
    },
    {
        id: crypto.randomUUID(),
        name: 'Benjamin',
        countries: ['US', 'DE', 'FR'],
        meaning: 'Sohn Der Rechten Hand'
    },
    {
        id: crypto.randomUUID(),
        name: 'Olivia',
        countries: ['US', 'GB', 'IT'],
        meaning: 'Olivenbaum'
    },
    {
        id: crypto.randomUUID(),
        name: 'Lucas',
        countries: ['ES', 'PT', 'US'],
        meaning: 'Licht'
    },
    {
        id: crypto.randomUUID(),
        name: 'Charlotte',
        countries: ['FR', 'US', 'DE'],
        meaning: 'Die Freie'
    },
    {
        id: crypto.randomUUID(),
        name: 'Ella',
        countries: ['DE', 'US', 'SE'],
        meaning: 'Licht'
    },
    {
        id: crypto.randomUUID(),
        name: 'Henry',
        countries: ['US', 'DE', 'GB'],
        meaning: 'Der Herrscher Des Hauses'
    },
    {
        id: crypto.randomUUID(),
        name: 'Amelia',
        countries: ['US', 'DE', 'FR'],
        meaning: 'Die Fleißige'
    },
    {
        id: crypto.randomUUID(),
        name: 'Alexander',
        countries: ['GB', 'RU', 'US'],
        meaning: 'Der Beschützer Der Menschheit'
    },
    {
        id: crypto.randomUUID(),
        name: 'Mila',
        countries: ['DE', 'US', 'RU'],
        meaning: 'Die Liebenswerte'
    },
    {
        id: crypto.randomUUID(),
        name: 'James',
        countries: ['US', 'GB'],
        meaning: 'Der Übernehmer'
    },
    {
        id: crypto.randomUUID(),
        name: 'Evelyn',
        countries: ['US', 'DE', 'FR'],
        meaning: 'Der Vögelchen Freund'
    },
    {
        id: crypto.randomUUID(),
        name: 'Aiden',
        countries: ['US', 'IE'],
        meaning: 'Kleines Feuer'
    },
    {
        id: crypto.randomUUID(),
        name: 'Luna',
        countries: ['US', 'IT', 'ES'],
        meaning: 'Mond'
    },
    {
        id: crypto.randomUUID(),
        name: 'Harper',
        countries: ['US', 'CA'],
        meaning: 'Die Harfenspielerin'
    },
    {
        id: crypto.randomUUID(),
        name: 'Leo',
        countries: ['DE', 'US', 'FR'],
        meaning: 'Löwe'
    },
    {
        id: crypto.randomUUID(),
        name: 'Mika',
        countries: ['FI'],
        meaning: 'Wer ist wie Gott?'
    },
    {
        id: crypto.randomUUID(),
        name: 'Aino',
        countries: ['FI'],
        meaning: 'Einzigartige'
    }
];
const db = new Array<Card>(...names);


export function getCards(country: string) {


    return db.filter((name) => name.countries.includes(country));
}

export function removeCard(id: string) {
    const index = db.findIndex((card) => card.id === id);
    if(index !== -1) {
        db.splice(index, 1);
    }
}

export function addCard() {
        db.push({
            id: crypto.randomUUID(),
            name: "test",
            countries: ["FI"],
            meaning: "test"
        });
}