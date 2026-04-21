import { StateComponent } from "../../../sanguine/types.js";

export type InkpadData = {
};

export type InkpadState = {
    prefab: string,
};

export type InkpadComponent = StateComponent<InkpadData, InkpadState>;

export const InkpadComponent = (data?: Partial<InkpadData>, state?: Partial<InkpadState>): InkpadComponent => {
    return {
        prefab: '',
        ...data,
        ...state,
        type: 'inkpad',
        entityId: '',
    };
};