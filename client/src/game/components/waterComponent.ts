import { StateComponent } from "../types.js";

export type WaterData = {
    wet: number,
};

export type WaterState = {
};

export type WaterComponent = StateComponent<WaterData, WaterState>;

export const waterComponent = (data?: Partial<WaterData>, state?: Partial<WaterState>): WaterComponent => {
    return {
        wet: 1,
        ...data,
        ...state,
        type: 'water',
        entityId: '',
    };
}