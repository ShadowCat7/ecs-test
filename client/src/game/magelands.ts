import { drawGrid } from "./draw/drawGrid.js";
import { createGame } from "./game.js";
import { UpdateOptions } from "./types.js";
import { data } from "./data/data.js";
import { initializePrefabs } from "./prefabs/prefabs.js";
import { changeScene, getCurrentScene } from "./scenes/sceneManager.js";
import { getControls } from "./controls.js";

export const createMagelands = (canvas: HTMLCanvasElement) => {
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
        if (getControls().buttons.map.current)
            drawGrid(ctx, 0, 0, canvasWidth, canvasHeight);

        // TODO h for help menu

        getCurrentScene()?.draw(ctx);
    };

    const update = (options: UpdateOptions) => {
        getCurrentScene()?.update(options);
    }

    createGame(canvas, () => { }, update, draw);

    initializePrefabs().then(() => {
        changeScene('card');
    });
}