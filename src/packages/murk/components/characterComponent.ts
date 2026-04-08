import { StateComponent } from "../../sanguine/types.js";

export type CharacterData = {
    characterId: string,
};

export type CharacterState = {
};

export type CharacterComponent = StateComponent<CharacterData, CharacterState>;

export const CharacterComponent = (data?: Partial<CharacterData>, state?: Partial<CharacterState>): CharacterComponent => {
    return {
        characterId: '',
        ...data,
        ...state,
        type: 'Character',
        entityId: '',
    };
}