import { StateComponent } from "../../sanguine/types.js";

export type EdibleData = {
    food?: number,
};

export type EdibleState = {
};

export type EdibleComponent = StateComponent<EdibleData, EdibleState>;

export const EdibleComponent = (data?: Partial<EdibleData>, state?: Partial<EdibleState>): EdibleComponent => {
    return {
        ...data,
        ...state,
        type: 'edible',
        entityId: '',
    };
}