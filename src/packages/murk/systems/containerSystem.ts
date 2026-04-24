import { getMousePosition } from "../../sanguine/buttons.js";
import { getEntity, removeEntity } from "../../sanguine/entities/entities.js";
import { getSize } from "../../sanguine/render/render.js";
import { getScreenSize } from "../../sanguine/screen.js";
import { createTrigger } from "../../sanguine/system.js";
import { Component, Entity, Message, System, WheelMessage } from "../../sanguine/types.js";
import { sum } from "../../sanguine/util/array.js";
import { clamp } from "../../sanguine/util/number.js";
import { ContainerComponent } from "../components/ui/containerComponent.js";
import { ContainerAddMessage, ContainerDeleteChildrenMessage, ContainerScrollMessage } from "./messageTypes.js";

const getContainerSize = (container: Entity) => {
    const firstChild = container.children[0];
    if (!firstChild) return 0;
    const lastChild = container.children[container.children.length - 1];
    const lastChildSize = getSize(lastChild.renders ?? []);
    console.log(lastChildSize);
    return (lastChild.y - firstChild.y) + lastChildSize.height;
};

export const containerSystem = (
    messager: (message: Message) => void,
): System => {
    const wheelEvents: number[] = [];
    const messagePadding = 40;

    return {
        triggers: [
            createTrigger<ContainerAddMessage>('containerAdd', (message) => {
                const { containerId, entityId } = message;
                const container = getEntity(containerId);
                const containerComponent = container.getComponent<ContainerComponent>('container');
                if (!containerComponent) throw new Error('Container is not a container');

                const containerSize = getContainerSize(container);
                console.log(containerSize);
                const lastY = containerSize + containerComponent.scrollY;

                const entity = getEntity(entityId);
                if (!entity.renders) entity.renders = [];
                entity.y = lastY + messagePadding;
                if (entity.y === messagePadding) entity.y -= messagePadding - 20;
                container.children.push(entity);
            }),
            createTrigger<ContainerScrollMessage>('containerScroll', (message) => {
                const { containerId, scroll } = message;
                // TODO capture current containerId
                wheelEvents.push(scroll);
            }),
            createTrigger<ContainerDeleteChildrenMessage>('containerDeleteChildren', (message) => {
                const { containerId } = message;
                const container = getEntity(containerId);

                for (const entity of container.children) {
                    removeEntity(entity.id);
                }
                container.children.length = 0;
                const containerComponent = container.getComponent<ContainerComponent>('container')!;
                containerComponent.scrollY = 0;
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

            if (!scrollingContainerComponent) {
                wheelEvents.length = 0;
                return;
            }

            let totalScroll = sum(wheelEvents, x => x);
            wheelEvents.length = 0;

            const [_, screenHeight] = getScreenSize();
            const container = getEntity(scrollingContainerComponent.entityId);
            const containerHeight = getContainerSize(container);
            const lowest = containerHeight <= (screenHeight - 40) ? 0 : (screenHeight - 40) - containerHeight;

            const oldPrevious = scrollingContainerComponent.scrollY;
            scrollingContainerComponent.scrollY += totalScroll;

            scrollingContainerComponent.scrollY = clamp(scrollingContainerComponent.scrollY, 0, lowest);

            for (const child of container.children) {
                child.y = child.y - oldPrevious + scrollingContainerComponent.scrollY;
            }
        },
    };
};
