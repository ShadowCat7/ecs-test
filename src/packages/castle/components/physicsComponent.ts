import { StateComponent } from "../../sanguine/types.js";

export type PhysicsData = {
    acceleration?: number,
    topSpeed: number,
};

export type PhysicsState = {
    velocityX: number,
    velocityY: number,
    moveToX?: number,
    moveToY?: number,
    velocityToX?: number,
    velocityToY?: number,
};

export type PhysicsComponent = StateComponent<PhysicsData, PhysicsState>;

export const physicsComponent = (data?: Partial<PhysicsData>, state?: Partial<PhysicsState>): PhysicsComponent => {
    return {
        topSpeed: 10,
        ...data,
        velocityX: 0,
        velocityY: 0,
        ...state,
        type: 'physics',
        entityId: '',
    };
}