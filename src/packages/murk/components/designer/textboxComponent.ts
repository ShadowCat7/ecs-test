import { StateComponent } from "../../../sanguine/types.js";

export type TextboxData = {
};

export type TextboxState = {
    active: boolean;
};

export type TextboxComponent = StateComponent<TextboxData, TextboxState>;

export const TextboxComponent = (data?: Partial<TextboxData>, state?: Partial<TextboxState>): TextboxComponent => {
    return {
        active: false,
        ...data,
        ...state,
        type: 'textbox',
        entityId: '',
    };
};