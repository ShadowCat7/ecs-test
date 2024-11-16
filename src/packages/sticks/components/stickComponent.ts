import { StateComponent } from "../../sanguine/types.js";

export type StickData = {
};

export type StickState = {
};

export type StickComponent = StateComponent<StickData, StickState>;

export const stickComponent = (data?: Partial<StickData>, state?: Partial<StickState>): StickComponent => {
    return {
        ...data,
        ...state,
        type: 'stick',
        entityId: '',
    };
}