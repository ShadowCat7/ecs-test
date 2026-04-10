// import { setViewPort } from '../constants.js';

import { Mouse } from "../../packages/sanguine/types.js";
import { raiseControlEvent } from "./buttons.js";

const EPSILON = 0.00000001;
const TARGET_FPS = 60;
const FPS_SMOOTHNESS = 0.90;
const FPS_ONE_FRAME_WEIGHT = 1.0 - FPS_SMOOTHNESS;
const MIN_FPS = 20;
const MAX_SPF = 1 / MIN_FPS;

export type UpdateFunc = (buttonsPressed: {}, mouse: Mouse, timeSinceLastUpdate: number) => void;
export type DrawFunc = (mouse: Mouse) => void;

export const createEngine = (canvas: HTMLCanvasElement, updateFunc: UpdateFunc, drawFunc: DrawFunc) => {
    let animationFrameId: number = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    const buttonsPressed: { [key: string]: boolean; } = {};
    const keysPressedLabel = document.getElementById('keypressed');
    const mouse = {
        x: 0,
        y: 0,
        leftClick: false,
        rightClick: false,
    };
    let fps = TARGET_FPS;

    const mainLoop = () => {
        let previousUpdate = new Date().getTime();
        let previousDraw = new Date().getTime();

        const update = () => {
            let currentTime = new Date().getTime();
            let timeSinceLastUpdate = (currentTime - previousUpdate) / 1000;
            previousUpdate = currentTime;

            if (timeSinceLastUpdate < EPSILON)
                timeSinceLastUpdate = EPSILON;
            else if (timeSinceLastUpdate > MAX_SPF)
                timeSinceLastUpdate = MAX_SPF;

            setTimeout(() => {
                updateFunc(buttonsPressed, mouse, timeSinceLastUpdate);
            }, 0);

            animationFrameId = (requestAnimationFrame as any)(draw, canvas);
        };

        const draw = () => {
            let currentTime = new Date().getTime();
            let timeSinceLastDraw = (currentTime - previousDraw) / 1000;
            let currentFps = 1 / timeSinceLastDraw;
            previousDraw = currentTime;

            fps = fps * FPS_SMOOTHNESS + currentFps * FPS_ONE_FRAME_WEIGHT;
            if (fps === Infinity) fps = 60;

            setTimeout(() => {
                drawFunc(mouse);
            }, 0);

            timeoutId = setTimeout(update, 0);
        };

        update();
    };

    const start = () => {
        mainLoop();
    };

    const stop = () => {
        cancelAnimationFrame(animationFrameId);
        clearTimeout(timeoutId);
    };

    const setViewPort = (window: Window | null) => {
        const width = window?.visualViewport?.width;
        const height = window?.visualViewport?.height;

        // setViewPort(width, height);
        // canvas.width = width;
        // canvas.height = height;
    };
    setViewPort(document.defaultView);

    // window === document.defaultView
    document.defaultView?.addEventListener('resize', (e) => {
        setViewPort(e.view);
    });

    document.addEventListener('keydown', (e) => {
        e.stopPropagation();

        if (!(buttonsPressed['KeyR'] && buttonsPressed['ControlLeft'] ||
            buttonsPressed['Tab'] && buttonsPressed['AltLeft'] ||
            buttonsPressed['F5'] || buttonsPressed['F12'])
        ) {
            e.preventDefault();
        }

        if (e.repeat) return;

        if (keysPressedLabel) {
            keysPressedLabel.innerHTML = (e.code);
        }
        buttonsPressed[e.code] = true;

        raiseControlEvent(e);
    });

    document.addEventListener('keyup', (e) => {
        e.stopPropagation();
        buttonsPressed[e.code] = false;
        raiseControlEvent(e);
    });

    canvas.onmousedown = (e) => {
        e.stopPropagation();
        e.preventDefault();

        mouse.leftClick = e.button === 0;
        mouse.rightClick = e.button === 2;
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    };

    canvas.onmouseup = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (e.button === 0) {
            mouse.leftClick = false;
        } else if (e.button === 2) {
            mouse.rightClick = false;
        }

        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    };

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    }, false);

    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        mouse.x = touch.pageX - canvas.offsetLeft;
        mouse.y = touch.pageY - canvas.offsetTop;
    }, false);

    return {
        getFps: () => fps,
        setViewPort,
        start,
        stop,
    };
};

export type Engine = ReturnType<typeof createEngine>;