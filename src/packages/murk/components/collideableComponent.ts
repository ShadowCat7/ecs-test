import { StateComponent } from "../../sanguine/types.js";

export type CollideableData = {
    radius: number
};

export type CollideableState = {
    currentRadius: number,
};

export type CollideableComponent = StateComponent<CollideableData, CollideableState>;

export const CollideableComponent = (data?: Partial<CollideableData>, state?: Partial<CollideableState>): CollideableComponent => {
    return {
        radius: 0,
        ...data,
        currentRadius: data?.radius ?? 0,
        ...state,
        type: 'collideable',
        entityId: '',
    };
}