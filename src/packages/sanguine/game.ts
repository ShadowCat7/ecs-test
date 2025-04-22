import { updateControls } from './buttons.js';
import { drawText } from './draw/drawText.js';
import { Engine, createEngine } from './engine.js';
import { setComponentsDirectory } from './prefabs/componentMapper.js';
import { initializePrefabs } from './prefabs/prefabs.js';
import { Mouse } from './types.js';

let engine: Engine | null = null;

export type ProvidedDraw = (ctx: CanvasRenderingContext2D, mouse: Mouse) => void;

const draw = (canvas: HTMLCanvasElement, providedDraw: ProvidedDraw) => (mouse: Mouse) => {
    let ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    providedDraw(ctx, mouse)

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const fps = Math.round(engine?.getFps() ?? 0);
    // if should draw fps
    drawText(ctx, `${fps} fps`, 5, 5, {
        fontSize: 16,
    });
};

export type ProvidedUpdate = (elapsedTime: number) => void;

const update = (providedUpdate: ProvidedUpdate) => (
    buttonsPressed: { [key: string]: boolean },
    mouse: Mouse,
    elapsedTime: number
) => {
    updateControls(buttonsPressed, mouse);

    providedUpdate(elapsedTime);
};

export const createGame = async (
    canvas: HTMLCanvasElement,
    prefabLocations: string[],
    componentsDirectory: string,
    providedUpdate: ProvidedUpdate,
    providedDraw: ProvidedDraw,
) => {
    document.addEventListener('DOMContentLoaded', () => {
        engine = createEngine(canvas, update(providedUpdate), draw(canvas, providedDraw));
        engine.start();
    });

    setComponentsDirectory(componentsDirectory);

    await initializePrefabs(prefabLocations);
};