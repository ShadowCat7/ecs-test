import { midpoint } from "../physics/distance.js";
import { areRectanglesIntersecting } from "../physics/rectangle.js";

export interface Coordinate {
    x: number,
    y: number,
}

export const createQuadtree = <T extends Coordinate>(data: T[]) => {
    let minX = data[0]?.x ?? 0;
    let minY = data[0]?.y ?? 0;
    let maxX = data[0]?.x ?? 1;
    let maxY = data[0]?.y ?? 1;

    for (let item of data) {
        const { x, y } = item;
        if (minX > x) minX = x;
        if (minY > y) minY = y;
        if (maxX < x) maxX = x;
        if (maxY < y) maxY = y;
    }

    minX -= 10;
    maxX += 10;
    minY -= 10;
    maxY += 10;

    let tree = createNodes([minX, minY], [maxX, maxY], data);

    const addNode = (item: T) => {
        tree = zoomOut(tree, item);
    }

    return {
        search: (x: number, y: number, width: number) => search(tree, x, y, width),
        nearest: (x: number, y: number, width: number) => nearest(tree, x, y, width),
        addNode,
        removeItem: (item: T) => removeItem(tree, item),
    }
}

type Node<T extends Coordinate> = {
    mid: [number, number],
    max: [number, number],
    nodes?: [[Node<T>, Node<T>], [Node<T>, Node<T>]],
    data: T[],
}

const removeItem = <T extends Coordinate>(node: Node<T>, item: T) => {
    const { nodes, data, mid: [midX, midY] } = node;
    const { x, y } = item;

    const xIndex = x < midX ? 0 : 1;
    const yIndex = y < midY ? 0 : 1;

    const index = data.indexOf(item);
    if (index < 0) {
        return;
    }

    data.splice(index, 1);

    if (!nodes) return;

    removeItem(nodes[xIndex][yIndex], item);
}

const zoomOut = <T extends Coordinate>(node: Node<T>, item: T): Node<T> => {
    debugger
    const { mid, max, data } = node;
    const [midX, midY] = mid;
    const [maxX, maxY] = max;
    const min: [number, number] = [midX - (maxX - midX), midY - (maxY - midY)];
    const [minX, minY] = min;

    const { x, y } = item;

    if (x >= minX && x < maxX && y >= minY && y < minY) {
        addItemToNode(node, item);
        return node;
    }

    let newMin = min;
    let newMid = mid;
    let newMax = max;

    let xIndex = 0;
    let yIndex = 0;

    if (x < minX) {
        newMin = [minX - (maxX - minX), minY];
        newMid = min;
    } else {
        newMid = max;
        newMax = [maxX + maxX - minX, maxY];
        xIndex = 1;
    }

    if (y < minY) {
        newMin = [newMin[0], minY - (maxY - minY)];
        newMid = [newMid[0], minY];
    } else {
        newMid = [newMax[0], maxY];
        newMax = [newMax[0], maxY + maxY - minY];
        yIndex = 1;
    }

    const nodes: [[Node<T>, Node<T>], [Node<T>, Node<T>]] = [[{
        mid: [NaN, NaN],
        max: [NaN, NaN],
        data: [],
    }, {
        mid: [NaN, NaN],
        max: [NaN, NaN],
        data: [],
    }], [{
        mid: [NaN, NaN],
        max: [NaN, NaN],
        data: [],
    }, {
        mid: [NaN, NaN],
        max: [NaN, NaN],
        data: [],
    }]];

    nodes[xIndex][yIndex] = node;

    const newNode: Node<T> = {
        mid: newMid,
        max: newMax,
        data,
        nodes,
    };

    return zoomOut(newNode, item);
}

const addItemToNode = <T extends Coordinate>(node: Node<T>, item: T) => {
    const { nodes, data, mid: [midX, midY] } = node;
    const { x, y } = item;

    const xIndex = x < midX ? 0 : 1;
    const yIndex = y < midY ? 0 : 1;

    data.push(item);

    if (!nodes) return;

    addItemToNode(nodes[xIndex][yIndex], item);
}


const search = <T extends Coordinate>(node: Node<T>, x: number, y: number, width: number): T[] => {
    const { nodes, data, mid: [midX, midY], max: [maxX] } = node;
    if (!nodes) return data;
    if (maxX - midX < width) return data;

    const xIndex = x < midX ? 0 : 1;
    const yIndex = y < midY ? 0 : 1;

    return search(nodes[xIndex][yIndex], x, y, width);
}

const nearest = <T extends Coordinate>(node: Node<T>, x: number, y: number, width: number): T[] => {
    const { nodes, data, mid: [midX, midY], max: [maxX, maxY] } = node;
    if (!nodes) return data;

    const minSearchX = x - width;
    const minSearchY = y - width;
    const maxSearchX = x + width;
    const maxSearchY = y + width;

    const nodeWidth = 2 * (maxX - midX);
    const minX = maxX - nodeWidth;
    const minY = maxY - nodeWidth;

    if (minX > minSearchX
        && minY > minSearchY
        && maxX < maxSearchX
        && maxY < maxSearchY
    ) return data;

    const searchWidth = width * 2;
    if (areRectanglesIntersecting(minSearchX, minSearchY, searchWidth, searchWidth, minX, minY, nodeWidth, nodeWidth)) {
        return [
            ...nearest(nodes[0][0], x, y, width),
            ...nearest(nodes[1][0], x, y, width),
            ...nearest(nodes[0][1], x, y, width),
            ...nearest(nodes[1][1], x, y, width),
        ];
    }
    return [];
}

const createNodes = <T extends Coordinate>(min: [number, number], max: [number, number], data: T[]): Node<T> => {
    if (data.length <= 1) {
        return {
            mid: [NaN, NaN],
            max: [NaN, NaN],
            data: [],
        };
    }
    if (!data.some(d => data[0].x !== d.x || data[0].y !== d.y)) {
        return {
            mid: [NaN, NaN],
            max: [NaN, NaN],
            data,
        };
    }
    const [minX, minY] = min;
    const [maxX, maxY] = max;
    const mid = midpoint(minX, minY, maxX, maxY);
    const [midX, midY] = mid;

    const setupData: [[T[], T[]], [T[], T[]]] = [
        [[], []],
        [[], []],
    ];

    for (let item of data) {
        const { x, y } = item;
        const xIndex = x < midX ? 0 : 1;
        const yIndex = y < midY ? 0 : 1;
        setupData[xIndex][yIndex].push(item);
    }

    return {
        mid,
        max,
        data,
        nodes: [
            [createNodes(min, mid, setupData[0][0]), createNodes([midX, minY], [maxX, midY], setupData[1][0])],
            [createNodes([minX, midY], [midX, maxY], setupData[0][1]), createNodes(mid, max, setupData[1][1])]
        ]
    };
}