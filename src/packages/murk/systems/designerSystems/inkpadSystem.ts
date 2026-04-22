import { getMousePosition } from "../../../sanguine/buttons.js";
import { addEntity, getEntity } from "../../../sanguine/entities/entities.js";
import { copyRenders } from "../../../sanguine/entities/entity.js";
import { isPointInRender } from "../../../sanguine/physics/intersection.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { getSize } from "../../../sanguine/render/render.js";
import { Rectangle, Text } from "../../../sanguine/render/types.js";
import { getScreenSize } from "../../../sanguine/screen.js";
import { createTrigger } from "../../../sanguine/system.js";
import { Component, Entity, Message, System } from "../../../sanguine/types.js";
import { InkpadComponent } from "../../components/designer/inkpadComponent.js";
import { StampComponent } from "../../components/designer/stampComponent.js";
import { createControlTrigger, getControl } from "../../controls.js";
import { CreateStampMessage, PlaceStampMessage } from "./types.js";

const prefabs = ['player', 'wall'];

export const inkpadSystem = (
    messager: (message: Message) => void,
): System => {
    let selectedStamp: Entity | null = null;

    const panel = getPrefab('inkpadPanel').createEntity(0, 0);
    panel.renders ??= [];
    const [_, screenY] = getScreenSize();
    const rectangle: Rectangle = {
        color: 'dimgrey',
        height: screenY,
        width: 400,
        type: 'rectangle',
        x: 0,
        y: 0,
        z: 10,
        overlay: true,
    };
    panel.renders.push(rectangle);
    addEntity(panel);

    let y = 50;

    for (const prefabName of prefabs) {
        const entity = getPrefab('inkpad').createEntity(50, y);
        const inkpad = entity.getComponent<InkpadComponent>('inkpad')!;
        inkpad.prefab = prefabName;
        const prefab = getPrefab(prefabName);
        entity.renders = copyRenders(prefab.shapes) ?? [];
        const { width, height } = getSize(entity.renders);
        const text: Text = {
            type: 'text',
            text: prefabName,
            x: width + 20,
            y: 0,
            z: 2,
            yAlign: 0,
            color: 'white',
        };
        entity.renders.push(text);
        for (const render of entity.renders) {
            render.overlay = true;
            render.z = 2;
        }
        y += height + 20;
        addEntity(entity);
        panel.children.push(entity);
    }

    return {
        triggers: [
            createTrigger<PlaceStampMessage>('placeStamp', (message) => {
                // unhighlight selected stamp
                selectedStamp = null;
            }),
        ],
        componentType: 'inkpad',
        process: (components: Component[], elapsedTime: number) => {
            const leftClick = getControl('select');
            if (!leftClick.current || leftClick.previous) return;

            const [mouseX, mouseY] = getMousePosition();

            for (const component of components as StampComponent[]) {
                const entity = getEntity(component.entityId);
                if (!entity.visible) continue;
                if (!entity.renders?.length) continue;
                const clicked = isPointInRender(mouseX, mouseY, entity.renders, entity.x, entity.y);
                if (clicked) {
                    selectedStamp = entity;
                    const { prefab } = entity.getComponent<InkpadComponent>('inkpad')!;
                    const message: CreateStampMessage = {
                        type: 'createStamp',
                        prefab,
                    };
                    messager(message);
                    // highlight selected stamp
                    break;
                }
            }


        },
    };
};