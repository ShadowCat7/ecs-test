import { Attributes, Character } from "./types.js";

export const createCharacter = (attributes: Attributes, items: [], statuses: []): Character => {
    const { strength, agility, finesse,  mind, heart, wyrd, luck } = attributes;

    const weight = items.length;
    const capacity = Math.max(strength / 2 - weight, 0);
    const defense = /*items.find(x => x.type === 'armor')?.defense ?? */1;

    const health = Math.ceil(strength / 1.2 + agility / 4 + heart / 3 + wyrd / 5);
    const hit = Math.max(0.75 * strength + 0.25 * agility, agility) + wyrd / 100; // based on weapon?
    const avoid = agility * capacity / 10 + wyrd / 100;
    const magic = Math.max(mind, heart) + wyrd / 100; // based on magic type?

    return {
        ...attributes,
        health,
        defense,
        weight,
        capacity,
        hit,
        avoid,
        magic,
    };
}