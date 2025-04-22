import { StateComponent } from "../../sanguine/types.js";

export type SizeData = {
    size: number,
    isPlayer?: true,
};

export type SizeState = {
    scaleSpeed?: number,
};

export type SizeComponent = StateComponent<SizeData, SizeState>;

export const SizeComponent = (data?: Partial<SizeData>, state?: Partial<SizeState>): SizeComponent => {
    return {
        size: 1,
        ...data,
        ...state,
        type: 'size',
        entityId: '',
    };
}