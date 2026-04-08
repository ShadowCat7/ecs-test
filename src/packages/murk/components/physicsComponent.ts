import { StateComponent } from "../../sanguine/types.js";

export type PhysicsData = {
    acceleration?: number,
    topSpeed: number,
    friction?: number,
};

export type PhysicsState = {
    velocityX: number,
    velocityY: number,
    moveToX?: number,
    moveToY?: number,
    velocityToX?: number,
    velocityToY?: number,
    previousX: number,
    previousY: number,
    previousVelocityX: number,
    previousVelocityY: number,
};

export type PhysicsComponent = StateComponent<PhysicsData, PhysicsState>;

export const physicsComponent = (data?: Partial<PhysicsData>, state?: Partial<PhysicsState>): PhysicsComponent => {
    return {
        topSpeed: 10,
        ...data,
        velocityX: 0,
        velocityY: 0,
        previousX: 0,
        previousY: 0,
        previousVelocityX: 0,
        previousVelocityY: 0,
        ...state,
        type: 'physics',
        entityId: '',
    };
}