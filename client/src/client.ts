import { createMagelands } from "./game/magelands.js";

(async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    canvas.oncontextmenu = () => false;
    canvas.width = 800;
    canvas.height = 600;

    await createMagelands(canvas);
})();