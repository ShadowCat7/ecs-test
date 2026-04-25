import { getScreenSize, setScreenToWindow } from "../../screen.js";

const identity = <T>(x: T) => x;

// must specify a precision for floats in fragment shaders
// same for most sampler types

// uniforms have 128 vec4 limit in vertex shader (both?) 
// attributes only in vertex shader

// gl_Position needs a vec4

// #region Uniforms 
// float: 1f
// vec2: 2f
// vec3: 3f
// vec4: 4f
// int: 1i
// ivec2: 2i
// ivec3: 3i
// ivec4: 4i
// sampler: 1i
// uint: 1u
// uvec2: 2u
// uvec3: 3u
// uvec4: 4u
// mat2: Matrix2fv
// mat3: Matrix3fv
// mat4: Matrix4fv
type UniformType = {
    [K in keyof WebGL2RenderingContext]: K extends `uniform${infer J}` ? J : never
}[keyof WebGL2RenderingContext];

type Uniform = {
    type: UniformType,
    name: string,
    array?: number,
};
// #endregion

export const createProgram = <TUniform extends Uniform, TAttribute extends Attribute>(
    ctx: WebGL2RenderingContext,
    uniforms: TUniform[],
    attributes: TAttribute[],
) => {
    const program = ctx.createProgram();

    let vertexShaderSource = `#version 300 es`;
    let fragmentShaderSource = `#version 300 es`;

    for (const uniform of uniforms) {
        const { type, name, array } = uniform;
        const arrayText = (type.endsWith('v') && array !== undefined && isFinite(array) && array > 0) ? `[${array}]` : '';
        const string = `\nuniform ${type} ${name}${arrayText}`;
        vertexShaderSource += string;
        fragmentShaderSource += string;
    }

    // only get 16
    // vertices limited to 65536 (probably)
    for (const attribute of attributes) {
        const { type, name, array } = attribute;
        const arrayText = (type.endsWith('v') && array !== undefined && isFinite(array) && array > 0) ? `[${array}]` : '';
        const inString = `\nin ${type} ${name}${arrayText}`;
        const outString = `\nin ${type} ${name}${arrayText}`;
        vertexShaderSource += inString + outString;
        fragmentShaderSource += inString;
    }

    vertexShaderSource += `
void main()
{
    gl_PointSize = 150.0;
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}`;

    fragmentShaderSource += `
precision mediump float;

out vec4 fragColor;

void main()
{
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

    const vertexShader = ctx.createShader(ctx.VERTEX_SHADER)!;
    ctx.shaderSource(vertexShader, vertexShaderSource);
    ctx.compileShader(vertexShader);
    ctx.attachShader(program, vertexShader);

    const fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER)!;
    ctx.shaderSource(fragmentShader, fragmentShaderSource);
    ctx.compileShader(fragmentShader);
    ctx.attachShader(program, fragmentShader);

    ctx.linkProgram(program);

    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
        console.error(ctx.getShaderInfoLog(vertexShader));
        console.error(ctx.getShaderInfoLog(fragmentShader));
        throw new Error('Shaders failed to link');
    }

    type UniformData = Record<(typeof uniforms)[number]['name'], any>;
    const uniformsMapped = uniforms.map(x => {
        const location = ctx.getUniformLocation(program, x.name);
        return {
            ...x,
            location,
        };
    });

    // can be set before linking
    const attributesMapped = attributes.map(x => {
        const location = ctx.getAttribLocation(program, x.name);
        ctx.enableVertexAttribArray(location);
        return {
            ...x,
            location,
        };
    });

    // draw
    return (uniformData: UniformData, attributeData: any[]) => {
        for (const uniform of uniformsMapped) {
            const { name, type, array, location } = uniform;
            const data = (uniformData as any)[name] ?? []; // TODO good default
            const arrayLength = (type.endsWith('v') && array !== undefined && isFinite(array) && array > 0) ? array : 0;
            const func = ctx[`uniform${type}`] as any;
            if (arrayLength)
                func(location, data.flatMap(identity)); // fill with empty; depends upon type
            else
                func(location, ...data);
        }

        for (const attribute of attributes) {
            const { name, type, array, location } = attribute;
            const data = (attributeData as any)[name] ?? []; // TODO good default
            const arrayLength = (type.endsWith('v') && array !== undefined && isFinite(array) && array > 0) ? array : 0;
            // const func = ctx[`attribute${type}`] as any;
            // if (arrayLength)
            //     func(location, data.flatMap(identity)); // fill with empty; depends upon type
            // else
            //     func(location, ...data);
        }
        // minimize calls to this
        ctx.useProgram(program);

        // what are the draw modes?
        ctx.drawArrays(ctx.POINTS, 0, 1);
    };

    // now can we detach shaders?

    // clean up when shader no longer used, with `ctx.deleteProgram`.
};

const canvas = document.getElementsByTagName('canvas')[0]!;
setScreenToWindow();
const [screenWidth, screenHeight] = getScreenSize();
canvas.width = screenWidth;
canvas.height = screenHeight;
const ctx = canvas.getContext('webgl2')!;
const draw = createProgram(ctx, [], []);
draw({}, []);
