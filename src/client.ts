import { startup } from "./packages/sticks/startup.js";

(async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    canvas.oncontextmenu = () => false;
    canvas.width = 800;
    canvas.height = 600;

    await startup(canvas);
})();