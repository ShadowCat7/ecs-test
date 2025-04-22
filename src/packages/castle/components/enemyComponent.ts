import { StateComponent } from "../../sanguine/types.js";

export type EnemyData = {
    enemyType: string,
};

export type EnemyState = {
    state?: {
        type: string,
        data?: any,
    },
};

export type EnemyComponent = StateComponent<EnemyData, EnemyState>;

export const enemyComponent = (data?: Partial<EnemyData>, state?: Partial<EnemyState>): EnemyComponent => {
    return {
        enemyType: '',
        ...data,
        ...state,
        type: 'enemy',
        entityId: '',
    };
}