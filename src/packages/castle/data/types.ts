export type Attributes = {
    level: number,
    strength: number,
    agility: number,
    mind: number,
    heart: number,
    wyrd: number,
};

export type SecondaryAttributes = {
    health: number,
    defense: number,
    weight: number,
    capacity: number,
    hit: number,
    avoid: number,
    magic: number,
};

export type Skills = 'weapon' | 'magic' | 'entertain'
    | 'knowledge' | 'steal' | 'perception'

export type Character = Attributes & SecondaryAttributes & {

}