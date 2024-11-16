import { StateComponent } from "../../../sanguine/types.js";

export type TakeStickData = {
    sticks: number,
};

export type TakeStickState = {
};

export type TakeStickComponent = StateComponent<TakeStickData, TakeStickState>;

export const takeStickComponent = (data?: Partial<TakeStickData>, state?: Partial<TakeStickState>): TakeStickComponent => {
    return {
        sticks: 1,
        ...data,
        ...state,
        type: 'takeStick',
        entityId: '',
    };
}