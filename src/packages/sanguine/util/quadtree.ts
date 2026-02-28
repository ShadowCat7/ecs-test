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

    let tree = createNodes([minX, minY], [maxX, maxY], [...data]);

    const addNode = (item: T) => {
        tree = zoomOut(tree, item);
    }

    return {
        search: (x: number, y: number, width: number) => search(tree, x, y, width),
        nearest: (x: number, y: number, width: number) => nearest(tree, x, y, width),
        addNode,
        removeItem: (item: T) => removeItem(tree, item),
        getTree: () => tree,
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
    const { mid, max, data } = node;
    const [midX, midY] = mid;
    const [maxX, maxY] = max;
    const min: [number, number] = [midX - (maxX - midX), midY - (maxY - midY)];
    const [minX, minY] = min;

    const { x, y } = item;

    if (x >= minX && x < maxX && y >= minY && y < maxY) {
        addItemToNode(node, item);
        return node;
    }

    let newMin = min;
    let newMid = mid;
    let newMax = max;

    let xIndex = 0;
    let yIndex = 0;

    if (x < minX) {
        newMin[0] = minX - (maxX - minX);
        newMid[0] = minX;
    } else {
        newMid[0] = maxX;
        newMax[0] = maxX + maxX - minX;
        xIndex = 1;
    }

    if (y < minY) {
        newMin[1] = minY - (maxY - minY);
        newMid[1] = minY;
    } else {
        newMid[1] = maxY;
        newMax[1] = maxY + maxY - minY;
        yIndex = 1;
    }

    const [newMinX, newMinY] = newMin;
    const [newMidX, newMidY] = newMid;
    const [newMaxX, newMaxY] = newMax;

    const nodes: [[Node<T>, Node<T>], [Node<T>, Node<T>]] = [[
        {
            mid: midpoint(newMinX, newMinY, newMidX, newMidY),
            max: newMid,
            data: [],
        },
        {
            mid: midpoint(newMinX, newMidY, newMidX, newMaxY),
            max: [newMidX, newMaxY],
            data: [],
        }
    ], [
        {
            mid: midpoint(newMidX, newMinY, newMaxX, newMidY),
            max: [newMaxX, newMidY],
            data: [],
        },
        {
            mid: midpoint(newMidX, newMidY, newMaxX, newMaxY),
            max: newMax,
            data: [],
        }
    ]];

    nodes[xIndex][yIndex] = {
        ...nodes[xIndex][yIndex],
        nodes: node.nodes,
        data: node.data,
    };

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

    const minSearchX = x - width / 2;
    const minSearchY = y - width / 2;
    const maxSearchX = x + width / 2;
    const maxSearchY = y + width / 2;

    const nodeWidth = 2 * (maxX - midX);
    const minX = maxX - nodeWidth;
    const minY = maxY - nodeWidth;

    if (minX > minSearchX
        && minY > minSearchY
        && maxX < maxSearchX
        && maxY < maxSearchY
    ) return data;

    if (areRectanglesIntersecting(minSearchX, minSearchY, width, width, minX, minY, nodeWidth, nodeWidth)) {
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
    const [minX, minY] = min;
    const [maxX, maxY] = max;
    const mid = midpoint(minX, minY, maxX, maxY);
    const [midX, midY] = mid;

    if (data.length <= 1) {
        return {
            mid,
            max,
            data: [...data],
        };
    }
    if (!data.some(d => data[0].x !== d.x || data[0].y !== d.y)) {
        return {
            mid,
            max,
            data: [...data],
        };
    }

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
            [createNodes(min, mid, setupData[0][0]), createNodes([minX, midY], [midX, maxY], setupData[0][1])],
            [createNodes([midX, minY], [maxX, midY], setupData[1][0]), createNodes(mid, max, setupData[1][1])]
        ]
    };
}