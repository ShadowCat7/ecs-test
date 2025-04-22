import { StateComponent } from "../../sanguine/types.js";

export type DialogueData = {
};

export type DialogueState = {
    timer: number,
    current: string[] | null,
    index: number,
};

export type DialogueComponent = StateComponent<DialogueData, DialogueState>;

export const dialogueComponent = (data?: Partial<DialogueData>, state?: Partial<DialogueState>): DialogueComponent => {
    return {
        ...data,
        timer: 0,
        current: null,
        index: 0,
        ...state,
        type: 'dialogue',
        entityId: '',
    };
}