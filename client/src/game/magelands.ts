import { drawGrid } from "./draw/drawGrid.js";
import { createGame } from "./game.js"
import { createScene } from "./scenes/scene.js";
import { Mouse, UpdateOptions } from "./types.js";

let width = 0;
let height = 0;

export const createMagelands = (canvas: HTMLCanvasElement) => {
    width = canvas.width;
    height = canvas.height;

    let currentScene = createScene([]);

    const draw = (ctx: CanvasRenderingContext2D, mouse: Mouse) => {
        drawGrid(ctx, 0, 0, width, height);

        currentScene.draw({ ctx, mouse });
    };

    const update = (options: UpdateOptions) => {
        currentScene.update(options);
    }

    createGame(canvas, () => { }, update, draw);
}