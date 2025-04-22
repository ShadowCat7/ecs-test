import { StateComponent } from "../../sanguine/types.js";

export type CameraData = {
};

export type CameraState = {
    active: boolean,
    zoom: number,
    zoomSpeed: number,
    targetZoom: number,
};

export type CameraComponent = StateComponent<CameraData, CameraState>;

export const CameraComponent = (data?: Partial<CameraData>, state?: Partial<CameraState>): CameraComponent => {
    return {
        ...data,
        active: false,
        zoom: 1,
        zoomSpeed: 0,
        targetZoom: 1,
        ...state,
        type: 'camera',
        entityId: '',
    };
}