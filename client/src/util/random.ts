let seed: number;
const setSeed = (s: number) => {
    seed = s;
}

const createSeed = () => (Math.random() * 100000000000000000) | 0;

// Mulberry32 implementation
const generateRng = (a: number) => {
    return () => {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};

export let getSeededRandom = generateRng(seed!);
export const updateSeed = (newSeed: number) => {
    setSeed(newSeed);
    getSeededRandom = generateRng(newSeed);
}
updateSeed(createSeed());

const nextInt = (max: number, rand: () => number) => {
    return Math.floor(rand() * max);
}

export const randomInt = (max: number) => nextInt(max, Math.random);

export const seededInt = (max: number) => nextInt(max, getSeededRandom);