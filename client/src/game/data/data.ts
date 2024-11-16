export type Card = {
    type: string
}

export type Data = {
    deck: Card[],
    currentRoom: {
        sticks: number,
    },
}

export const data: Data = {
    deck: [],
    currentRoom: {
        sticks: 0,
    },
}