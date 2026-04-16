import { drawRectangle, drawRectangleOutline } from "../draw/drawRectangle.js";
import { drawText, measureText } from "../draw/drawText.js";
import { addRender } from "./renderQueue.js";
import { getCamera } from "../entities/entities.js";
import { Entity } from "../types.js";
import { Circle, Grid, Rectangle, Render, Text } from "./types.js";
import { assertUnreachable } from "../util/exhaustiveSwitch.js";
import { drawCircle, drawCircleOutline } from "../draw/drawCircle.js";
import { drawGrid } from "../draw/drawGrid.js";
import { CameraComponent } from "../../castle/components/cameraComponent.js";

export const getSize = (renderItem: Render) => {
    const { type } = renderItem;
    switch (type) {
        case "rectangle":
            return { width: renderItem.width, height: renderItem.height };
        case "circle":
            return { width: renderItem.radius * 2, height: renderItem.radius * 2 };
        case "text":
            throw new Error('Not implemented');
        case "grid":
            throw new Error('Not implemented');
        default:
            assertUnreachable(type);
            throw new Error('Not handled');
    }
};

const getRenderFunc = (renderItem: Render, entity: Entity) => {
    const { type } = renderItem;

    switch (type) {
        case "rectangle":
            return renderRectangle(renderItem, entity);
        case "circle":
            return renderCircle(renderItem, entity);
        case "text":
            return renderText(renderItem, entity);
        case "grid":
            return renderGrid(renderItem, entity);
        default:
            assertUnreachable(type);
            return () => { };
    }
};

let camera: Entity | null = null;

export const setupRender = (ctx: CanvasRenderingContext2D) => {
    camera = getCamera();
    if (!camera) throw new Error('No active camera');
    const cameraData = camera.getComponent<CameraComponent>('camera');
    if (!cameraData) throw new Error('No active camera');

    const scale = 1 / cameraData.zoom;
    ctx.scale(scale, scale);

    const drawX = -camera.x + ctx.canvas.width * cameraData.zoom / 2;
    const drawY = -camera.y + ctx.canvas.height * cameraData.zoom / 2;

    ctx.translate(drawX, drawY);
};

export const render = (renderItem: Render, entity: Entity) => {
    const renderFunc = getRenderFunc(renderItem, entity);

    addRender(renderItem.z, renderFunc);
};

const getCameraRelatedPosition = (renderItem: Render, entity: Entity, canvasWidth: number, canvasHeight: number) => {
    return [entity.x + renderItem.x, entity.y + renderItem.y];
};

export const renderRectangle = (renderItem: Rectangle, entity: Entity) => (ctx: CanvasRenderingContext2D) => {
    const { overlay, width, height, outline, outlineColor } = renderItem;

    if (overlay) {
        ctx.save();
        ctx.resetTransform();
    }

    const [x, y] = getCameraRelatedPosition(renderItem, entity, ctx.canvas.width, ctx.canvas.height);

    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(entity.rotation);
    ctx.translate(-x - width / 2, -y - height / 2);

    if (outline) {
        drawRectangleOutline(ctx, x, y, width, height, outline, outlineColor ?? 'black');
    }

    drawRectangle(ctx, x, y, width, height, 'white');

    if (overlay) ctx.restore();
};

export const renderCircle = (renderItem: Circle, entity: Entity) => (ctx: CanvasRenderingContext2D) => {
    const { overlay, radius, color, outline, outlineColor } = renderItem;

    if (overlay) {
        ctx.save();
        ctx.resetTransform();
    }

    const [x, y] = getCameraRelatedPosition(renderItem, entity, ctx.canvas.width, ctx.canvas.height);

    if (outline) {
        drawCircleOutline(ctx, x, y, radius + outline + 1, outlineColor ?? 'white', outline, entity.scale);
    }

    drawCircle(ctx, x, y, radius, color, entity.scale);

    if (overlay) ctx.restore();
};

export const renderText = (renderItem: Text, entity: Entity) => (ctx: CanvasRenderingContext2D) => {
    const { overlay, text, color, xAlign, yAlign } = renderItem;

    if (overlay) {
        ctx.save();
        ctx.resetTransform();
    }

    let [x, y] = getCameraRelatedPosition(renderItem, entity, ctx.canvas.width, ctx.canvas.height);

    const options = {
        textColor: color ?? 'black',
    };

    const { width, height } = measureText(text, x, y, options);

    if (xAlign === 0) {
        x -= width / 2;
    } else if (xAlign === 1) {
        x -= width;
    }

    if (yAlign === 0) {
        y -= height / 2;
    } else if (yAlign === -1) {
        y -= height;
    }

    drawText(ctx, text, x, y, options);

    if (overlay) ctx.restore();
};

export const renderGrid = (renderItem: Grid, entity: Entity) => (ctx: CanvasRenderingContext2D) => {
    const { overlay, width, height } = renderItem;

    if (overlay) {
        ctx.save();
        ctx.resetTransform();
    }

    const [x, y] = getCameraRelatedPosition(renderItem, entity, ctx.canvas.width, ctx.canvas.height);

    drawGrid(ctx, x, y, width, height, 30);

    if (overlay) ctx.restore();
};