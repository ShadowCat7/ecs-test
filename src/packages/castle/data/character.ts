import { Attributes, Character } from "./types.js";

export const createCharacter = (attributes: Attributes, items: []): Character => {
    const { level, strength, agility, mind, heart, wyrd } = attributes;

    const weight = items.length;
    const capacity = Math.max(strength / 2 - weight, 0);
    const defense = /*items.find(x => x.type === 'armor')?.defense ?? */1;

    const health = Math.ceil(strength / 1.2 + agility / 4 + heart / 3 + wyrd / 5 + level);
    const hit = Math.max(0.75 * strength + 0.25 * agility, agility) + level + wyrd / 100; // based on weapon?
    const avoid = (agility + level) * capacity / 10 + wyrd / 100;
    const magic = Math.max(mind, heart) + level + wyrd / 100; // based on magic type?

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