export type Render = Rectangle | Circle | Text | Grid;

export type Default = {
    x: number,
    y: number,
    z: number,
}

export type Shape = Default & {
    color: string,
    outline?: number,
    outlineColor?: string,
}

export type Rectangle = Shape & {
    type: 'rectangle',
    width: number,
    height: number,
}

export type Circle = Shape & {
    type: 'circle',
    radius: number,
}

export type Text = Default & {
    type: 'text',
    text: string,
}

export type Grid = Shape & {
    type: 'grid',
    width: number,
    height: number,
}