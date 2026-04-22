import { createGame } from "../sanguine/game.js";
import { getCurrentScene } from "../sanguine/sceneManager.js";
import { getFreshPress } from "./controls.js";
import { changeSceneType } from "./scenes/sceneHandler.js";

export const startup = async (canvas: HTMLCanvasElement) => {
    const draw = (ctx: CanvasRenderingContext2D) => {
        getCurrentScene()?.draw(ctx);
    };

    const update = (elapsedTime: number) => {
        if (getFreshPress('toggleDesigner')) {
            const type = getCurrentScene()?.getType() === 'designer' ? 'test' : 'designer';
            changeSceneType(type);
        }

        getCurrentScene()?.update(elapsedTime);
    };

    const prefabLocations = [
        './data/generalPrefabs.json',
    ];

    await createGame(canvas, prefabLocations, 'murk/components', update, draw);

    changeSceneType('designer');
};
