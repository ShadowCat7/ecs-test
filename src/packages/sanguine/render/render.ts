import { drawRectangle, drawRectangleOutline } from "../draw/drawRectangle.js";
import { drawText } from "../draw/drawText.js";
import { addRender } from "./renderQueue.js";
import { getCamera } from "../entities/entities.js";
import { Entity } from "../types.js";
import { Circle, Rectangle, Render, Text } from "./types.js";
import { assertUnreachable } from "../util/exhaustiveSwitch.js";

const getRenderFunc = (renderItem: Render, entity: Entity) => {
    const { type } = renderItem;

    switch (type) {
        case "rectangle":
            return renderRectangle(renderItem, entity);
        case "circle":
            return renderCircle(renderItem, entity);
        case "text":
            return renderText(renderItem, entity);
        default:
            assertUnreachable(type);
            return () => { };
    }
}

export const render = (renderItem: Render, entity: Entity) => {
    const renderFunc = getRenderFunc(renderItem, entity);

    addRender(renderItem.z, renderFunc);
}

const setup = (renderItem: Render, entity: Entity) => {
    const camera = getCamera();

    const x = entity.x + renderItem.x - camera.x;
    const y = entity.y + renderItem.y - camera.y;

    return [x, y];
}

export const renderRectangle = (renderItem: Rectangle, entity: Entity) => (ctx: CanvasRenderingContext2D) => {
    const { width, height, outline, outlineColor } = renderItem;
    const [x, y] = setup(renderItem, entity);

    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(entity.rotation);
    ctx.translate(-x - width / 2, -y - height /2);

    drawRectangle(ctx, x, y, width, height, 'white');
    if (outline) {
        drawRectangleOutline(ctx, x, y, width, height, outline, outlineColor ?? 'black');
    }

    ctx.resetTransform();
}

export const renderCircle = (renderItem: Circle, entity: Entity) => (ctx: CanvasRenderingContext2D) => {
    const { radius } = renderItem;
    const [x, y] = setup(renderItem, entity);

    // drawCircle(ctx, x, y, radius, 'white');
}

export const renderText = (renderItem: Text, entity: Entity) => (ctx: CanvasRenderingContext2D) => {
    const { text } = renderItem;
    const [x, y] = setup(renderItem, entity);

    drawText(ctx, text, x, y, {
        textColor: 'black'
    });
}