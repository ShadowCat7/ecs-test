export type RenderingFunc = (ctx: CanvasRenderingContext2D) => void

let queue: { [layer: number]: RenderingFunc[] } = {};

export const addRender = (layer: number, draw: RenderingFunc) => {
    let layerQueue = queue[layer];

    if (!layerQueue) {
        layerQueue = [];
        queue[layer] = layerQueue;
    }

    layerQueue.push(draw);
}

export const flushRenderQueue = (ctx: CanvasRenderingContext2D) => {
    for (const layer in queue) {
        for (const draw of queue[layer]) {
            draw(ctx);
        }
    }

    queue = {};
}