
import { PokemonType, GymLeader } from './types';

export const TYPE_CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export const TYPE_NAME_JP: Record<PokemonType, string> = {
  normal: "ノーマル", fire: "ほのお", water: "みず", electric: "でんき", grass: "くさ",
  ice: "こおり", fighting: "かくとう", poison: "どく", ground: "じめん", flying: "ひこう",
  psychic: "エスパー", bug: "むし", rock: "いわ", ghost: "ゴースト", dragon: "ドラゴン",
  dark: "あく", steel: "はがね", fairy: "フェアリー"
};

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: "bg-gray-400", fire: "bg-orange-500", water: "bg-blue-500", electric: "bg-yellow-400",
  grass: "bg-green-500", ice: "bg-cyan-300", fighting: "bg-red-700", poison: "bg-purple-500",
  ground: "bg-yellow-700", flying: "bg-indigo-300", psychic: "bg-pink-500", bug: "bg-lime-500",
  rock: "bg-yellow-800", ghost: "bg-purple-800", dragon: "bg-indigo-600", dark: "bg-gray-800",
  steel: "bg-gray-500", fairy: "bg-pink-300"
};

export const GYM_LEADERS: GymLeader[] = [
  { name: "カエデ", title: "セルクルジム", type: "bug", image: "https://picsum.photos/seed/kaede/400/300" },
  { name: "コルサ", title: "ボウルジム", type: "grass", image: "https://picsum.photos/seed/korsa/400/300" },
  { name: "ナンジャモ", title: "ハッコウジム", type: "electric", image: "https://picsum.photos/seed/ionoo/400/300" },
  { name: "ハイダイ", title: "カラフジム", type: "water", image: "https://picsum.photos/seed/haidai/400/300" },
  { name: "アオキ", title: "チャンプルジム", type: "normal", image: "https://picsum.photos/seed/aoki/400/300" },
];
