
import { PokemonData, PokemonType } from "../types";

export const fetchPokemon = async (nameOrId: string): Promise<PokemonData | null> => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);
    if (!res.ok) return null;
    const data = await res.json();
    
    return {
      id: data.id,
      name: data.name,
      types: data.types.map((t: any) => t.type.name as PokemonType),
      sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      stats: data.stats.map((s: any) => ({
        name: s.stat.name,
        value: s.base_stat
      }))
    };
  } catch (error) {
    console.error("Fetch Pokemon error:", error);
    return null;
  }
};
