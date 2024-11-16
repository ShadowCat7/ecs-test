import { StateComponent } from "../../sanguine/types.js";

export type FlammableData = {
    untilIgnite: number,
    untilVaporize: number,
};

export type FlammableState = {
    igniteDuration: number,
    vaporizeDuration: number,
};

export type FlammableComponent = StateComponent<FlammableData, FlammableState>;

export const flammableComponent = (data?: Partial<FlammableData>, state?: Partial<FlammableState>): FlammableComponent => {
    return {
        untilIgnite: 3,
        untilVaporize: 3,
        ...data,
        igniteDuration: 0,
        vaporizeDuration: 0,
        ...state,
        type: 'flammable',
        entityId: '',
    };
}