export type RenderingFunc = (ctx: CanvasRenderingContext2D) => void;

let queue: { [layer: number]: RenderingFunc[]; } = {};

export const addRender = (layer: number, draw: RenderingFunc) => {
    let layerQueue = queue[layer];

    if (!layerQueue) {
        layerQueue = [];
        queue[layer] = layerQueue;
    }

    layerQueue.push(draw);
};

export const flushRenderQueue = (ctx: CanvasRenderingContext2D) => {
    const layers = Object.keys(queue).map(x => +x).sort();
    for (const layer of layers) {
        for (const draw of queue[layer]) {
            draw(ctx);
        }
    }

    queue = {};
};