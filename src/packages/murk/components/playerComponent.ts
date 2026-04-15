import { StateComponent } from "../../sanguine/types.js";

export type PlayerData = {
};

export type PlayerState = {
    state?: 'dialogue'
};

export type PlayerComponent = StateComponent<PlayerData, PlayerState>;

export const PlayerComponent = (data?: Partial<PlayerData>, state?: Partial<PlayerState>): PlayerComponent => {
    return {
        ...data,
        ...state,
        type: 'player',
        entityId: '',
    };
}