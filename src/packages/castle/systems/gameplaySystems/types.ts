import { Message } from "../../../sanguine/types.js"

export type PlayerEatMessage = Message & {
    type: 'playerEat',
    amount: number,
}

export type LevelUpMessage = Message & {
    type: 'levelUp',
    level: number,
}

export type ZoomMessage = Message & {
    type: 'zoom',
    amount: number,
}