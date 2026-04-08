export type Attributes = {
    strength: number,
    agility: number,
    finesse: number,
    endurance: number,
    mind: number,
    heart: number,
    wyrd: number,
    luck: number,
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