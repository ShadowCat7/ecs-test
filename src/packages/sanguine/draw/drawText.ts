export type TextContextOptions = {
    fontSize?: number,
    font?: string,
    textColor?: string,
    textAlign?: CanvasTextAlign,
    textBaseline?: CanvasTextBaseline,
};

const defaultTextContextOptions = {
    fontSize: 30,
    font: 'LanaPixel',
    textColor: '#e0e0e0',
    textAlign: 'left' as const,
    textBaseline: 'top' as const,
};

const setupTextContext = (ctx: CanvasRenderingContext2D, options: TextContextOptions = defaultTextContextOptions) => {
    const {
        fontSize,
        font,
        textColor,
        textAlign,
        textBaseline,
    } = { ...defaultTextContextOptions, ...options };

    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
};

export type DrawTextOptions = TextContextOptions & {
    lineHeight?: number,
    verticalPadding?: number,
};

const defaultDrawTextOptions = {
    ...defaultTextContextOptions,
    lineHeight: 30,
    verticalPadding: 10,
};

export const DEFAULT_LINE_HEIGHT = 30;
export const DEFAULT_PADDING = 10;
export const drawText = (ctx: CanvasRenderingContext2D, text: string | string[], x: number, y: number, options: DrawTextOptions = defaultDrawTextOptions) => {
    const {
        lineHeight,
        verticalPadding,
    } = { ...defaultDrawTextOptions, ...options };

    setupTextContext(ctx, options);

    const textArray = typeof text === 'string' ? text.split('\n') : text;

    for (let i = 0; i < textArray.length; i++) {
        ctx.fillText(textArray[i], x, y + (lineHeight + verticalPadding) * i);
    }
};

const tempCanvas = document.createElement('canvas');
const tempCtx = tempCanvas.getContext('2d')!;
if (!tempCtx) throw new Error('Unable to create temporary 2D context.');
export const measureText = (text: string, x: number, y: number, options: DrawTextOptions = defaultDrawTextOptions) => {
    const {
        lineHeight,
        verticalPadding,
    } = { ...defaultDrawTextOptions, ...options };

    setupTextContext(tempCtx, options);
    const lines = text.split('\n').length;
    const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = tempCtx.measureText(text);

    return {
        width,
        height: actualBoundingBoxAscent + actualBoundingBoxDescent + (lineHeight + verticalPadding) * (lines - 1)
    };
};
