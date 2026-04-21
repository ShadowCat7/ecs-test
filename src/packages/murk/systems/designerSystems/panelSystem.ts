import { getEntity } from "../../../sanguine/entities/entities.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { PanelComponent } from "../../components/designer/panelComponent.js";
import { getControl } from "../../controls.js";

export const panelSystem = (
    messager: (message: Message) => void,
): System => {
    return {
        triggers: [
        ],
        componentType: 'panel',
        process: (components: Component[], elapsedTime: number) => {
            for (const component of components as PanelComponent[]) {
                const { control } = component;
                const controlValue = getControl(control as any);
                if (!controlValue) throw new Error(`Panel does not have an existing control: ${control}`);
                if (controlValue.current && !controlValue.previous) {
                    component.open = !component.open;

                    const entity = getEntity(component.entityId);
                    entity.visible = component.open;
                    for (const child of entity.children) {
                        child.visible = component.open;
                    }
                }
            }
        },
    };
};