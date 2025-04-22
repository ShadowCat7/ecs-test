import { createScene } from "../../sanguine/scene.js";
import { changeScene, resetScene } from "../../sanguine/sceneManager.js";
import { Entity } from "../../sanguine/types.js";
import { assertUnreachable } from "../../sanguine/util/exhaustiveSwitch.js";
import { cameraSystem } from "../systems/cameraSystem.js";
import { roomPlaySystems } from "../systems/gameplaySystems/roomPlaySystems.js";
import { SceneType } from "../types.js";

const getScene = (sceneType: SceneType) => {
    switch (sceneType) {
        case "test":
            return (x: Entity[]) => createScene(x, ...roomPlaySystems(), cameraSystem);
        default:
            return assertUnreachable(sceneType);
    }
}

export const changeSceneType = (sceneType: SceneType) => {
    resetScene();
    const sceneCreator = getScene(sceneType);
    const scene = sceneCreator([]);
    changeScene(scene);
}