import { getComponents, getEntity } from "../../../sanguine/entities/entities.js";
import { showEntity } from "../../../sanguine/entities/entity.js";
import { createTrigger } from "../../../sanguine/system.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { PanelComponent } from "../../components/designer/panelComponent.js";
import { getControl } from "../../controls.js";
import { ClearPanelMessage, OpenPanelMessage } from "./types.js";

export const togglePanel = (panel: PanelComponent, force: boolean) => {
    panel.open = force ?? !panel.open;
    const entity = getEntity(panel.entityId);
    showEntity(entity, panel.open);
};

export const getPanel = (panelControl: string) => {
    const components = getComponents<PanelComponent>('panel');
    if (!components) return null;
    const panelComponent = components.find(x => x.control === panelControl);
    return panelComponent;
};

export const panelSystem = (
    messager: (message: Message) => void,
): System => {
    return {
        triggers: [
            createTrigger<OpenPanelMessage>('openPanel', message => {
                const { panelControl } = message;
                const panelComponent = getPanel(panelControl);
                const panels = getComponents<PanelComponent>('panel');
                if (!panelComponent || panelComponent.open || !panels) return;
                for (const panel of panels) togglePanel(panel, false);
                togglePanel(panelComponent, true);
            }),
            createTrigger<ClearPanelMessage>('clearPanel', message => {
                const { panelControl } = message;
                const panelComponent = getPanel(panelControl);
                if (!panelComponent) return;
                const panel = getEntity(panelComponent.entityId);
                panel.children.length = 0;
            }),
        ],
        componentType: 'panel',
        process: (components: Component[], elapsedTime: number) => {
            for (const component of components as PanelComponent[]) {
                const { control } = component;
                const controlValue = getControl(control as any);
                if (!controlValue) throw new Error(`Panel does not have an existing control: ${control}`);
                if (controlValue.current && !controlValue.previous) {
                    togglePanel(component);
                }
            }
        },
    };
};