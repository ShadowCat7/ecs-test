let screenWidth = 800;
let screenHeight = 600;

export const getScreenSize = (): [number, number] => [screenWidth, screenHeight];

export const setScreenToWindow = () => {
    screenWidth = window.document.body.clientWidth;
    screenHeight = window.document.body.clientHeight;
}

export const setScreenSize = (width: number, height: number) => {
    screenWidth = width;
    screenHeight = height;
}