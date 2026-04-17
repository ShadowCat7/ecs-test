import { getMousePosition } from "../../sanguine/buttons.js";
import { measureText } from "../../sanguine/draw/drawText.js";
import { getEntity, removeEntity } from "../../sanguine/entities/entities.js";
import { Text } from "../../sanguine/render/types.js";
import { getScreenSize } from "../../sanguine/screen.js";
import { createTrigger } from "../../sanguine/system.js";
import { Component, Entity, Message, System, WheelMessage } from "../../sanguine/types.js";
import { sum } from "../../sanguine/util/array.js";
import { clamp } from "../../sanguine/util/number.js";
import { ContainerComponent } from "../components/ui/containerComponent.js";
import { ContainerAddMessage, ContainerDeleteChildrenMessage } from "./messageTypes.js";

const getContainerSize = (container: Entity) => {
    const lastChild = container.children[container.children.length - 1];
    if (!lastChild) return 0;
    const textRender = lastChild.renders?.find(x => x.type === 'text') as Text;
    return lastChild.y + measureText(textRender.text, lastChild.x, lastChild.y).height;
};

export const containerSystem = (
    messager: (message: Message) => void,
): System => {
    const wheelEvents: number[] = [];

    return {
        triggers: [
            createTrigger<ContainerAddMessage>('containerAdd', (message) => {
                const { containerId, entityId } = message;
                const container = getEntity(containerId);
                const containerComponent = container.getComponent<ContainerComponent>('container');
                if (!containerComponent) throw new Error('Container is not a container');

                const nextY = getContainerSize(container) + 40;

                const entity = getEntity(entityId);
                entity.y = nextY;
                container.children.push(entity);

                const entityHeight = measureText((entity.renders?.find(x => x.type === 'text') as Text).text, 0, 0).height;

                if (entity.y + entityHeight > getScreenSize()[1]) {
                    // start to scroll
                }
            }),
            createTrigger<ContainerDeleteChildrenMessage>('containerDeleteChildren', (message) => {
                const { containerId } = message;
                const container = getEntity(containerId);

                for (const entity of container.children) {
                    removeEntity(entity.id);
                }
                container.children.length = 0;
            }),
            createTrigger<WheelMessage>('wheel', ({ delta }) => {
                wheelEvents.push(-delta);
            }),
        ],
        componentType: 'container',
        process: (components: Component[], elapsedTime: number) => {
            if (!wheelEvents.length) return;

            // TODO get relevant container to scroll
            const [mouseX, mouseY] = getMousePosition();

            let scrollingContainerComponent: ContainerComponent | null = null;
            for (const component of components as ContainerComponent[]) {
                scrollingContainerComponent = component;
            }

            const totalScroll = sum(wheelEvents, x => x);
            wheelEvents.length = 0;
            if (!scrollingContainerComponent) return;

            const container = getEntity(scrollingContainerComponent.entityId);
            scrollingContainerComponent.scrollY += totalScroll;
            const containerHeight = getContainerSize(container) + 20;

            const [_, screenHeight] = getScreenSize();
            const lowest = containerHeight <= screenHeight ? 0 : screenHeight - containerHeight;

            scrollingContainerComponent.scrollY = clamp(scrollingContainerComponent.scrollY, 0, lowest);

            for (const child of container.children) {
                if (!child.renders?.length) continue;
                for (const render of child.renders) {
                    render.y = scrollingContainerComponent.scrollY;
                }
            }
        },
    };
};
