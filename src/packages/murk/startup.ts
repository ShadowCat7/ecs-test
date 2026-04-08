import { drawGrid } from "../sanguine/draw/drawGrid.js";
import { createGame } from "../sanguine/game.js";
import { getCurrentScene } from "../sanguine/sceneManager.js";
import { GRID_SIZE } from "./constants/game.js";
import { changeSceneType } from "./scenes/sceneHandler.js";

export const startup = async (canvas: HTMLCanvasElement) => {
    const draw = (ctx: CanvasRenderingContext2D) => {
        const { width: canvasWidth, height: canvasHeight } = canvas;
        // if (getControl('map').current)
        // drawGrid(ctx, 0, 0, canvasWidth, canvasHeight, GRID_SIZE);

        getCurrentScene()?.draw(ctx);
    };

    const update = (elapsedTime: number) => {
        getCurrentScene()?.update(elapsedTime);
    }

    const prefabLocations = [
        './data/generalPrefabs.json',
    ];

    await createGame(canvas, prefabLocations, 'murk/components', update, draw);

    changeSceneType('test');
}