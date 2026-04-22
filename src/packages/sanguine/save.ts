import { getPrefab } from "./prefabs/prefabs.js";
import { Entity } from "./types.js";
import { createMap } from "./util/array.js";

const LOCAL_STORAGE_KEY = 'CURRENT_LEVEL';

export const save = (entities: Entity[]) => {
    const data = entities.map(({ x, y, prefab, components }) => ({
        x,
        y,
        type: prefab?.type ?? '',
        components,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

export const load = () => {
    let data: unknown[] = [];
    try {
        data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!);
    } catch (e) {
        console.error(e);
    }

    if (!Array.isArray(data)) console.error('localStorage data is not formatted as a JSON array.');

    const entities = data?.map(d => {
        if (typeof d !== 'object' || !d
            || !('x' in d) || typeof d.x !== 'number' || !isFinite(d.x)
            || !('y' in d) || typeof d.y !== 'number' || !isFinite(d.y)
            || !('type' in d) || typeof d.type !== 'string'
            || !('components' in d) || !Array.isArray(d.components)
        ) throw new Error('malformed saved entity:', { cause: JSON.stringify(d) });
        if (d.components.some(x => !('type' in x) && x.type !== 'string')) throw new Error('malformed saved entity:', { cause: JSON.stringify(d) });
        const { x, y, type, components } = d;
        const componentMap = createMap(components, x => x.type);

        const entity = getPrefab(type).createEntity(x, y);
        for (const component of entity.components) {
            const componentData = componentMap.get(component.type);
            Object.assign(component, componentData);
        }
        return entity;
    });

    return entities ?? [];
};
