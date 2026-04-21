import { StateComponent } from "../../../sanguine/types.js";

export type StampData = {
};

export type StampState = {
    prefab: string,
    carried?: boolean,
};

export type StampComponent = StateComponent<StampData, StampState>;

export const StampComponent = (data?: Partial<StampData>, state?: Partial<StampState>): StampComponent => {
    return {
        prefab: '',
        ...data,
        ...state,
        type: 'stamp',
        entityId: '',
    };
};