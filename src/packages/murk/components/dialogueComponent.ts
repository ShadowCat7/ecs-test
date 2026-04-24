import { StateComponent } from "../../sanguine/types.js";

export type DialogueData = {
};

export type DialogueState = {
};

export type DialogueComponent = StateComponent<DialogueData, DialogueState>;

export const dialogueComponent = (data?: Partial<DialogueData>, state?: Partial<DialogueState>): DialogueComponent => {
    return {
        ...data,
        ...state,
        type: 'dialogue',
        entityId: '',
    };
};
