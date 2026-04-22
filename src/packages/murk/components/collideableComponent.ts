import { StateComponent } from "../../sanguine/types.js";

export type CollideableData = {
    radius: number,
};

export type CollideableState = {
};

export type CollideableComponent = StateComponent<CollideableData, CollideableState>;

export const CollideableComponent = (data?: Partial<CollideableData>, state?: Partial<CollideableState>): CollideableComponent => {
    return {
        radius: 0,
        ...data,
        ...state,
        type: 'collideable',
        entityId: '',
    };
};