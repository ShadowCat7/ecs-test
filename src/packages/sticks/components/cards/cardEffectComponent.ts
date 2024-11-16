import { StateComponent } from "../../../sanguine/types.js";

export type CardEffectData = {
    cardEffects: [],
};

export type CardEffectState = {
};

export type CardEffectComponent = StateComponent<CardEffectData, CardEffectState>;

export const cardComponent = (data?: Partial<CardEffectData>, state?: Partial<CardEffectState>): CardEffectComponent => {
    return {
        cardEffects: [],
        ...data,
        ...state,
        type: 'card',
        entityId: '',
    };
}