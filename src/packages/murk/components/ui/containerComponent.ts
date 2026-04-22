import { StateComponent } from "../../../sanguine/types.js";

export type ContainerData = {
    scroll: boolean;
};

export type ContainerState = {
    scrollY: number;
};

export type ContainerComponent = StateComponent<ContainerData, ContainerState>;

export const ContainerComponent = (data?: Partial<ContainerData>, state?: Partial<ContainerState>): ContainerComponent => {
    return {
        scroll: false,
        ...data,
        scrollY: 0, 
        ...state,
        type: 'container',
        entityId: '',
    };
};