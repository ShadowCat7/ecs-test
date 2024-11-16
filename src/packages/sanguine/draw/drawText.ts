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

    if (typeof text === 'string') {
        ctx.fillText(text, x, y);
    } else {
        for (let i = 0; i < text.length; i++) {
            ctx.fillText(text[i], x, y + (lineHeight + verticalPadding) * i);
        }
    }
};
