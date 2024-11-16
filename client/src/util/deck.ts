import { seededInt } from "./random.js";

const shuffle = <T>(array: T[]) => {
    for (let i = 0; i < array.length; i++) {
        const index = seededInt(array.length - i);
        const value = array[index];
        array[index] = array[i];
        array[i] = value;
    }
}

export type Deck<T> = ReturnType<typeof createDeck<T>>;

export const createDeck = <T>(array: T[]) => {
    let deck = [...array];
    let deckPointer = -1;
    let discard: T[] = [];

    shuffle(deck);

    return {
        drawCard: () => {
            if (deck.length === 0 && discard.length === 0) return null;

            deckPointer++;
            if (deckPointer === deck.length) {
                deck = discard;
                discard = [];
                shuffle(deck);
                deckPointer = 0;
            }

            console.log(deck)
            console.log(deckPointer)

            return deck[deckPointer] ?? null;
        },
        discard: (item: T) => {
            discard.push(item);
            console.log(discard)
        },
    }
}