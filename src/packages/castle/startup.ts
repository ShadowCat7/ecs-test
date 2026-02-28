import { drawGrid } from "../sanguine/draw/drawGrid.js";
import { createGame } from "../sanguine/game.js";
import { getCurrentScene } from "../sanguine/sceneManager.js";
import { getControl } from "./controls.js";
import { changeSceneType } from "./scenes/sceneHandler.js";
import { GRID_SIZE } from "./constants/game.js";

export const startup = async (canvas: HTMLCanvasElement) => {
    const { width: canvasWidth, height: canvasHeight } = canvas;

    const draw = (ctx: CanvasRenderingContext2D) => {
        // if (getControl('map').current)
        //     drawGrid(ctx, 0, 0, canvasWidth, canvasHeight, GRID_SIZE);

        getCurrentScene()?.draw(ctx);
    };

    const update = (elapsedTime: number) => {
        getCurrentScene()?.update(elapsedTime);
    }

    const prefabLocations = [
        './data/generalPrefabs.json',
    ];

    await createGame(canvas, prefabLocations, 'castle/components', update, draw);

    changeSceneType('test');
}