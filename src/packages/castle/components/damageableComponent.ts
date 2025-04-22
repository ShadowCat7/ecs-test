import { StateComponent } from "../../sanguine/types.js";

export type DamageableData = {
};

export type DamageableState = {
};

export type DamageableComponent = StateComponent<DamageableData, DamageableState>;

export const DamageableComponent = (data?: Partial<DamageableData>, state?: Partial<DamageableState>): DamageableComponent => {
    return {
        ...data,
        ...state,
        type: 'damageable',
        entityId: '',
    };
}