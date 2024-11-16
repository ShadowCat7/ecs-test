import { StateComponent } from "../types.js";

export type FireData = {
    heat: number,
};

export type FireState = {
};

export type FireComponent = StateComponent<FireData, FireState>;

export const fireComponent = (data?: Partial<FireData>, state?: Partial<FireState>): FireComponent => {
    return {
        heat: 1,
        ...data,
        ...state,
        type: 'fire',
        entityId: '',
    };
}