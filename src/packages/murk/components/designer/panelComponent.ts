import { StateComponent } from "../../../sanguine/types.js";

export type PanelData = {
    control: string,
};

export type PanelState = {
    open: boolean,
};

export type PanelComponent = StateComponent<PanelData, PanelState>;

export const PanelComponent = (data?: Partial<PanelData>, state?: Partial<PanelState>): PanelComponent => {
    return {
        open: false,
        control: '',
        ...data,
        ...state,
        type: 'panel',
        entityId: '',
    };
};