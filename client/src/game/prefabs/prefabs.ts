import { prefab } from "./prefab.js";
import { Prefab } from "./types.js";
import { getComponent } from "../components/mapper.js";
import { Component } from "../types.js";

const prefabData: {
    [type: string]: Prefab
} = {};

const componentsMap: {
    [type: string]: <TData, TState>(data?: TData, state?: TState) => Component,
} = {};

const initPrefab = async (data: any, allData: any[]) => {
    const { type, components, renders, prefabs } = data;

    if (prefabData[type]) return;

    const nestedPrefabData = prefabs?.map((x: any) => {
        const existingData = prefabData[x.type];
        if (existingData) return existingData;

        const d = allData.find(y => y.type === x.type);
        return initPrefab(d, allData);
    });

    const mappedComponents = await Promise.all(components.map(async (x: any) => {
        const { type, ...rest } = x;
        let creator = componentsMap[type];

        if (!creator) {
            creator = await getComponent(type);
            componentsMap[type] = creator;
        }

        return () => creator(rest);
    }));

    const p = prefab(
        type,
        mappedComponents,
        renders?.map((x: any) => ({
            x: 0,
            y: 0,
            ...x
        })),
        nestedPrefabData,
        // script TODO
    );

    prefabData[type] = p;

    return p;
}

export const initializePrefabs = async () => {
    const gpResponse = await fetch('data/generalPrefabs.json');
    const generalPrefabs = await gpResponse.json();

    const cardResponse = fetch('data/cardData.json');
    const enemyResponse = fetch('data/enemyData.json');

    for (let data of generalPrefabs) {
        await initPrefab(data, generalPrefabs);
    }

    const cardData = await (await cardResponse).json();

    for (let data of cardData) {
        await initPrefab(data, cardData);
    }

    const enemyData = await (await enemyResponse).json();

    for (let data of enemyData) {
        await initPrefab(data, enemyData);
    }

    return 1;
}

export const getPrefab = (type: string) => {
    return prefabData[type];
}