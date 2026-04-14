import { StateComponent } from "../../sanguine/types.js";

export type ConversationData = {
    story: string;
};

export type ConversationState = {
};

export type ConversationComponent = StateComponent<ConversationData, ConversationState>;

export const ConversationComponent = (data?: Partial<ConversationData>, state?: Partial<ConversationState>): ConversationComponent => {
    return {
        story: '',
        ...data,
        ...state,
        type: 'conversation',
        entityId: '',
    };
};