import { StateComponent } from "../../types.js";

export type CardData = {
};

export type CardState = {
};

export type CardComponent = StateComponent<CardData, CardState>;

export const cardComponent = (data?: Partial<CardData>, state?: Partial<CardState>): CardComponent => {
    return {
        ...data,
        ...state,
        type: 'card',
        entityId: '',
    };
}