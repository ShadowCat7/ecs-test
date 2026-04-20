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
    let maxScrolled = false;
    let animating = false;
    let animationDuration = 0.5;
    let currentDuration = 0;
    let animatingDistance = 0;
    let startingDistance = 0;

    const messagePadding = 40;

    return {
        triggers: [
            createTrigger<ContainerAddMessage>('containerAdd', (message) => {
                const { containerId, entityId } = message;
                const container = getEntity(containerId);
                const containerComponent = container.getComponent<ContainerComponent>('container');
                if (!containerComponent) throw new Error('Container is not a container');

                const lastY = getContainerSize(container);

                const entity = getEntity(entityId);
                entity.y = lastY + messagePadding;
                if (entity.y === messagePadding) entity.y -= messagePadding - 20;
                container.children.push(entity);

                const entityHeight = measureText((entity.renders?.find(x => x.type === 'text') as Text).text, 0, 0).height;

                const [_, screenHeight] = getScreenSize();
                if ((lastY < screenHeight || maxScrolled) && entity.y + entityHeight > screenHeight) {
                    currentDuration = 0;
                    animating = true;
                    startingDistance = (screenHeight - 20) - lastY;
                    animatingDistance = entityHeight + messagePadding;
                    wheelEvents.push(animatingDistance);
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
                if (animating) {
                    animating = false;
                    wheelEvents.length = 0;
                }
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

            if (animating) {
                if (currentDuration >= animationDuration) {
                    currentDuration = 0;
                    totalScroll = -animatingDistance;
                    animating = false;
                } else {
                    currentDuration += elapsedTime;
                    const x = currentDuration / animationDuration;
                    const animatedSpeed = 1 - (1 - x) * (1 - x);
                    const newLocation = -animatingDistance * animatedSpeed + startingDistance;
                    totalScroll = newLocation - scrollingContainerComponent.scrollY;
                    wheelEvents.push(animatingDistance);
                }
            }

            const container = getEntity(scrollingContainerComponent.entityId);
            scrollingContainerComponent.scrollY += totalScroll;
            const containerHeight = getContainerSize(container);

            const [_, screenHeight] = getScreenSize();
            const lowest = containerHeight <= (screenHeight - 20) ? 0 : (screenHeight - 20) - containerHeight;

            scrollingContainerComponent.scrollY = clamp(scrollingContainerComponent.scrollY, 0, lowest);

            maxScrolled = scrollingContainerComponent.scrollY === lowest;

            for (const child of container.children) {
                if (!child.renders?.length) continue;
                for (const render of child.renders) {
                    render.y = scrollingContainerComponent.scrollY;
                }
            }
        },
    };
};
