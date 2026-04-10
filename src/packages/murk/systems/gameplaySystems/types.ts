import { Entity, Message } from "../../../sanguine/types.js"

export type CollisionMessage = Message & {
    entity1: Entity,
    entity2: Entity,
    collisionPoint: [number, number],
    time: number,
    timeAfterCollision: number,
};

export type PlayerEatMessage = Message & {
    type: 'playerEat',
    amount: number,
}

export type PlayerEatenMessage = Message & {
    type: 'playerEaten',
    eaten: Entity,
}

export type PlayerBouncedMessage = Message & {
    type: 'playerBounced',
    eater: Entity,
    timeOfCollision: number,
    timeAfterCollision: number,
    collisionPoint: [number, number],
}

export type LevelUpMessage = Message & {
    type: 'levelUp',
    level: number,
}

export type LevelDownMessage = Message & {
    type: 'levelDown',
    level: number,
}

export type ZoomMessage = Message & {
    type: 'zoom',
    amount: number,
}

export type StoryStartMessage = Message & {
    type: 'storyStart',
    name: string,
};
