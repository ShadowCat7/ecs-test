import { StateComponent } from "../../sanguine/types.js";

export type EatData = {
};

export type EatState = {
};

export type EatComponent = StateComponent<EatData, EatState>;

export const EatComponent = (data?: Partial<EatData>, state?: Partial<EatState>): EatComponent => {
    return {
        ...data,
        ...state,
        type: 'eat',
        entityId: '',
    };
}