
export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface PokemonData {
  id: number;
  name: string;
  types: PokemonType[];
  sprite: string;
  stats: { name: string; value: number }[];
}

export interface GymLeader {
  name: string;
  title: string;
  type: PokemonType;
  image: string;
}

export type AppView = 'pokedex' | 'party' | 'gym' | 'camera';
