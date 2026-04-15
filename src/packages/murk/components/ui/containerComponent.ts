import { StateComponent } from "../../../sanguine/types.js";

export type ContainerData = {
    scroll: boolean;
};

export type ContainerState = {
};

export type ContainerComponent = StateComponent<ContainerData, ContainerState>;

export const ContainerComponent = (data?: Partial<ContainerData>, state?: Partial<ContainerState>): ContainerComponent => {
    return {
        scroll: false,
        ...data,
        ...state,
        type: 'container',
        entityId: '',
    };
};