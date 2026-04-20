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
    maxWidth?: number,
};

export const DEFAULT_LINE_HEIGHT = 30;
export const DEFAULT_PADDING = 10;

const defaultDrawTextOptions = {
    ...defaultTextContextOptions,
    lineHeight: DEFAULT_LINE_HEIGHT,
    verticalPadding: DEFAULT_PADDING,
};
export const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, options: DrawTextOptions = defaultDrawTextOptions) => {
    const filledOptions = {
        ...defaultDrawTextOptions,
        ...options,
    };
    const {
        lineHeight,
        verticalPadding,
        maxWidth,
    } = filledOptions;

    setupTextContext(ctx, filledOptions);

    const textArray = maxWidth ? delineate(text, maxWidth) : text.split('\n');

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
        maxWidth,
    } = { ...defaultDrawTextOptions, ...options };

    setupTextContext(tempCtx, options);
    const lines = maxWidth ? delineate(text, maxWidth) : text.split('\n');
    return measureLines(lines, lineHeight, verticalPadding);
};

const measureLines = (lines: string[], lineHeight: number, verticalPadding: number) => {
    let totalWidth = 0;
    let totalHeight = (lineHeight + verticalPadding) * lines.length - verticalPadding;
    for (const line of lines) {
        const { width } = tempCtx.measureText(line);
        if (width > totalWidth) totalWidth = width;
    }
    return {
        width: totalWidth,
        height: totalHeight,
    };
};

const delineate = (text: string, maxWidth: number) => {
    const lineBreaks = text.split('\n');

    const lines: string[] = [''];
    let index = 0;
    let x = 0;
    let biggestWidth = 0;

    const spaceWidth = tempCtx.measureText(' ').width;

    for (const line of lineBreaks) {
        for (const word of line.split(' ')) {
            const withSpace = ' ' + word;
            const { width } = tempCtx.measureText(x === 0 ? word : withSpace);
            if ((x + (x ? width + spaceWidth : width)) > maxWidth) {
                lines.push(word);
                if (x > biggestWidth) biggestWidth = x;
                x = width;
                index++;
            } else {
                lines[index] += x > 0 ? withSpace : word;
                x += spaceWidth + width;
            }
        }
        if (x > biggestWidth) biggestWidth = x;
        x = 0;
        lines.push('');
        index++;
    }

    lines.length = lines.length - 1;

    return lines;
};
