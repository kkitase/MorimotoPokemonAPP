
import { GoogleGenAI } from "@google/genai";
import { PokemonType } from "../types";
import { TYPE_NAME_JP } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIStrategyAdvice = async (enemyType: PokemonType, playerTypes: PokemonType[]) => {
  try {
    const playerTypeNames = playerTypes.map(t => TYPE_NAME_JP[t]).join(', ');
    const enemyTypeName = TYPE_NAME_JP[enemyType];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `あなたはポケモンの熟練トレーナーです。相手のタイプは「${enemyTypeName}」です。
      私の手持ちポケモンのタイプは「${playerTypeNames}」です。
      この相手に対して、どのような立ち回りをすべきか、またお勧めの技の構成や有利なタイプを
      プロの視点で簡潔に3つのポイントで日本語でアドバイスしてください。`,
    });

    return response.text;
  } catch (error) {
    console.error("AI strategy fetch failed:", error);
    return "アドバイスの取得に失敗しました。";
  }
};
