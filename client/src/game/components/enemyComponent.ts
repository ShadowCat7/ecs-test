import { StateComponent } from "../types.js";

export type EnemyData = {
};

export type EnemyState = {
};

export type EnemyComponent = StateComponent<EnemyData, EnemyState>;

export const enemyComponent = (data?: Partial<EnemyData>, state?: Partial<EnemyState>): EnemyComponent => {
    return {
        ...data,
        ...state,
        type: 'enemy',
        entityId: '',
    };
}