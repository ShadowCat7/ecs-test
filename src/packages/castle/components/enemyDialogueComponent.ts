import { StateComponent } from "../../sanguine/types.js";

export type EnemyDialogueData = {
};

export type EnemyDialogueState = {
    timer: number,
    current: string[] | null,
    index: number,
};

export type EnemyDialogueComponent = StateComponent<EnemyDialogueData, EnemyDialogueState>;

export const enemyDialogueComponent = (data?: Partial<EnemyDialogueData>, state?: Partial<EnemyDialogueState>): EnemyDialogueComponent => {
    return {
        ...data,
        timer: 0,
        current: null,
        index: 0,
        ...state,
        type: 'enemyDialogue',
        entityId: '',
    };
}