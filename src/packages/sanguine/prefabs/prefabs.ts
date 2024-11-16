import { prefab } from "./prefab.js";
import { Prefab } from "../types.js";
import { getComponent } from "./componentMapper.js";
import { getValidDirectory } from "../util/directory.js";

const prefabData: {
    [type: string]: Prefab
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
        const creator = await getComponent(type);

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

export const initializePrefabs = async (prefabLocations: string[]) => {
    const prefabResponses = await Promise.all(prefabLocations.map(x => fetch('../../' + getValidDirectory(x))));
    const prefabDataList = (await Promise.all(prefabResponses.map(x => x.json()))).flat();

    for (let data of prefabDataList) {
        await initPrefab(data, prefabDataList);
    }
}

export const getPrefab = (type: string) => {
    return prefabData[type];
}