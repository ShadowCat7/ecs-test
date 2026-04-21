import { getMousePosition } from "../../../sanguine/buttons.js";
import { addEntity, getEntity, removeEntity } from "../../../sanguine/entities/entities.js";
import { copyRenders } from "../../../sanguine/entities/entity.js";
import { isPointInRender } from "../../../sanguine/physics/intersection.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { createTrigger } from "../../../sanguine/system.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { StampComponent } from "../../components/designer/stampComponent.js";
import { getControl } from "../../controls.js";
import { CreateStampMessage, PlaceStampMessage } from "./types.js";

export const stampSystem = (
    messager: (message: Message) => void,
): System => {
    return {
        triggers: [
            createTrigger<CreateStampMessage>('createStamp', (message) => {
                const [mouseX, mouseY] = getMousePosition();
                const { prefab } = message;
                const stamp = getPrefab('stamp').createEntity(mouseX, mouseY);
                const targetFab = getPrefab(prefab);
                stamp.renders ??= [];
                const copiedRenders = copyRenders(targetFab.shapes) ?? [];
                stamp.renders.push(...copiedRenders);
                const component = stamp.getComponent<StampComponent>('stamp')!;
                component.carried = true;
                component!.prefab = prefab;
                addEntity(stamp);
            }),
        ],
        componentType: 'stamp',
        process: (components: Component[], elapsedTime: number) => {
            const deleteControl = getControl('delete');

            for (const component of components as StampComponent[]) {
                const { carried } = component;
                if (carried) {
                    const [mouseX, mouseY] = getMousePosition();
                    const entity = getEntity(component.entityId);
                    entity.x = mouseX;
                    entity.y = mouseY;

                    const leftClick = getControl('select');

                    if (leftClick.current && !leftClick.previous) {
                        component.carried = undefined;
                        const message: PlaceStampMessage = {
                            type: 'placeStamp',
                        };
                        messager(message);
                    }
                }

                if (!deleteControl.current) continue;

                const [mouseX, mouseY] = getMousePosition();

                const entity = getEntity(component.entityId);
                if (!entity.renders?.length) continue;
                const hovered = isPointInRender(mouseX, mouseY, entity.renders, entity.x, entity.y);
                if (hovered) {
                    removeEntity(entity.id);
                }
            }


        },
    };
};