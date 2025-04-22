import { StateComponent } from "../../sanguine/types.js";

export type FollowData = {
};

export type FollowState = {
    following: string,
};

export type FollowComponent = StateComponent<FollowData, FollowState>;

export const FollowComponent = (data?: Partial<FollowData>, state?: Partial<FollowState>): FollowComponent => {
    return {
        ...data,
        following: '',
        ...state,
        type: 'follow',
        entityId: '',
    };
}