import { getMousePosition } from "../../../sanguine/buttons.js";
import { addEntity, getCamera, getComponents, getEntity, removeEntity } from "../../../sanguine/entities/entities.js";
import { copyRenders } from "../../../sanguine/entities/entity.js";
import { isPointInRender } from "../../../sanguine/physics/intersection.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { load } from "../../../sanguine/save.js";
import { createTrigger } from "../../../sanguine/system.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { StampComponent } from "../../components/designer/stampComponent.js";
import { createControlTrigger, getControl } from "../../controls.js";
import { AddPropertiesMessage, CreateStampMessage, OpenPanelMessage, PlaceStampMessage } from "./types.js";

export const stampSystem = (
    messager: (message: Message) => void,
): System => {
    const stampPrefab = getPrefab('stamp');

    const createStamp = (x: number, y: number, prefab: string, carried: boolean = false) => {
        const stamp = stampPrefab.createEntity(x, y);
        const targetFab = getPrefab(prefab);
        stamp.renders = copyRenders(targetFab.shapes) ?? [];

        const component = stamp.getComponent<StampComponent>('stamp')!;
        component.carried = carried;
        component!.prefab = prefab;
        addEntity(stamp);
        return stamp;
    };

    load().map(e => {
        // TODO store component info into stamp
        const { x, y, components, prefab } = e;
        return createStamp(x, y, prefab?.type ?? '');
    });

    return {
        triggers: [
            createTrigger<CreateStampMessage>('createStamp', (message) => {
                const [mouseX, mouseY] = getMousePosition();
                const { prefab } = message;
                createStamp(mouseX, mouseY, prefab, true);
            }),
            createControlTrigger('saveDesign', (message) => {
                if (!message.current || message.previous) return;
                console.log('saving...');
                const stamps = getComponents<StampComponent>('stamp') ?? [];
                const data = stamps.filter(x => !x.carried).map(s => {
                    const { x, y, components } = getEntity(s.entityId);
                    return {
                        x,
                        y,
                        type: s.prefab,
                        components,
                    };
                });
                localStorage.setItem('CURRENT_LEVEL', JSON.stringify(data));
                console.log('saved');
            }),
        ],
        componentType: 'stamp',
        process: (components: Component[], elapsedTime: number) => {
            const deleteControl = getControl('delete');
            const select = getControl('select');

            const carriedComponent = (components as StampComponent[]).find(x => x.carried);
            if (carriedComponent) {
                const [mouseX, mouseY] = getMousePosition();
                const entity = getEntity(carriedComponent.entityId);

                const camera = getCamera();
                entity.x = mouseX + camera.x;
                entity.y = mouseY + camera.y;

                if (deleteControl.current && !deleteControl.previous) {
                    removeEntity(entity.id);
                    return;
                }

                if (select.current && !select.previous) {
                    carriedComponent.carried = undefined;
                    const message: PlaceStampMessage = {
                        type: 'placeStamp',
                    };
                    messager(message);
                    return;
                }
            }

            if ((!deleteControl.current || deleteControl.previous) && (!select.current || select.previous)) return;

            for (const component of components as StampComponent[]) {
                if (component.carried) continue;

                const [mouseX, mouseY] = getMousePosition();

                const entity = getEntity(component.entityId);
                if (!entity.renders?.length) continue;
                const camera = getCamera();
                const hovered = isPointInRender(mouseX, mouseY, entity.renders, entity.x - camera.x, entity.y - camera.y);
                if (hovered && deleteControl.current && !deleteControl.previous) {
                    removeEntity(entity.id);
                } else if (hovered && select.current && !select.previous) {
                    console.log('open')
                    const openPanel: OpenPanelMessage = {
                        type: 'openPanel',
                        panelControl: 'properties',
                    };
                    messager(openPanel);
                    const addProperties: AddPropertiesMessage = {
                        type: 'addProperties',
                        prefab: component.prefab,
                    };
                    messager(addProperties);
                }
            }
        },
    };
};