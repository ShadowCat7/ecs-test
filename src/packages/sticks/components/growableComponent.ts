import { StateComponent } from "../../sanguine/types.js";

export type GrowableData = {
    untilGerminated: number,
    untilGrown: number,
};

export type GrowableState = {
    germinationDuration: number,
    growingDuration: number,
};

export type GrowableComponent = StateComponent<GrowableData, GrowableState>;

export const growableComponent = (data?: Partial<GrowableData>, state?: Partial<GrowableState>): GrowableComponent => {
    return {
        untilGerminated: 3,
        untilGrown: 3,
        ...data,
        germinationDuration: 0,
        growingDuration: 0,
        ...state,
        type: 'growable',
        entityId: '',
    };
}