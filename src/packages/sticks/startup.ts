import { drawGrid } from "../sanguine/draw/drawGrid.js";
import { createGame } from "../sanguine/game.js";
import { data } from "./types.js";
import { getCurrentScene } from "../sanguine/sceneManager.js";
import { getControl } from "./controls.js";
import { changeSceneType } from "./scenes/sceneHandler.js";
import { GRID_SIZE } from "./constants/game.js";

export const startup = async (canvas: HTMLCanvasElement) => {
    data.deck = [{
        type: 'take1',
    }, {
        type: 'take1',
    }, {
        type: 'take2',
    }, {
        type: 'take2',
    }, {
        type: 'take2',
    }, {
        type: 'take2',
    }, {
        type: 'take3',
    }, {
        type: 'take3',
    }];
 
    const { width: canvasWidth, height: canvasHeight } = canvas;

    const draw = (ctx: CanvasRenderingContext2D) => {
        if (getControl('map').current)
            drawGrid(ctx, 0, 0, canvasWidth, canvasHeight, GRID_SIZE);

        // TODO h for help menu

        getCurrentScene()?.draw(ctx);
    };

    const update = (elapsedTime: number) => {
        getCurrentScene()?.update(elapsedTime);
    }

    const prefabLocations = [
        'data/generalPrefabs.json',
        'data/cardData.json',
        'data/enemyData.json',
    ];

    await createGame(canvas, prefabLocations, 'sticks/components', update, draw);

    changeSceneType('card');
}