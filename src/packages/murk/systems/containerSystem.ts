import { measureText } from "../../sanguine/draw/drawText.js";
import { getEntity, removeEntity } from "../../sanguine/entities/entities.js";
import { Text } from "../../sanguine/render/types.js";
import { getScreenSize } from "../../sanguine/screen.js";
import { createTrigger } from "../../sanguine/system.js";
import { Component, Message, System } from "../../sanguine/types.js";
import { ContainerComponent } from "../components/ui/containerComponent.js";
import { ContainerAddMessage, ContainerDeleteChildrenMessage } from "./messageTypes.js";

export const containerSystem = (
    messager: (message: Message) => void,
): System => {
    return {
        triggers: [
            createTrigger<ContainerAddMessage>('containerAdd', (message) => {
                const { containerId, entityId } = message;
                const container = getEntity(containerId);
                const entity = getEntity(entityId);
                container.children.push(entity);
                const containerComponent = container.getComponent<ContainerComponent>('container');
                if (!containerComponent) throw new Error('Container is not a container');

                const lastAdded = container.children[container.children.length - 2];

                if (lastAdded) {
                    const textRender = lastAdded.renders?.find(x => x.type === 'text') as Text;
                    const { height } = measureText(textRender.text, 0, 0);
                    entity.y = lastAdded.y + height + 40;

                    const entityHeight = measureText((entity.renders?.find(x => x.type === 'text') as Text).text, 0, 0).height;

                    if (entity.y + entityHeight > getScreenSize()[1]) {
                        // start to scroll
                    }
                }
            }),
            createTrigger<ContainerDeleteChildrenMessage>('containerDeleteChildren', (message) => {
                const { containerId } = message;
                const container = getEntity(containerId);

                for (const entity of container.children) {
                    removeEntity(entity.id);
                }
            })
        ],
        componentType: 'container',
        process: (components: Component[], elapsedTime: number) => {
            for (let component of components) {

            }
        },
    };
};
