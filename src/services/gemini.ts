
import { GoogleGenAI } from "@google/genai";
import { PokemonType } from "../types";
import { TYPE_NAME_JP } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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

export const analyzeImage = async (imageUri: string) => {
  try {
    const base64Data = imageUri.split(',')[1];
    if (!base64Data) throw new Error("Invalid image data");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [
            { text: "このポケモンゲームの画面を解析してください。あなたは熟練のポケモンバトルの解説者です。\n以下の点を日本語でアドバイスしてください。\n1. 現在の状況（対戦相手、自分のポケモン、HP状況など）\n2. 次に取るべき最善のアクション（技の選択、交代、アイテム使用など）\n3. 相手の可能性がある行動と対策\n\n初心者にもわかりやすく、しかし戦略的に深いアドバイスをお願いします。" },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }
      ]
    });

    return response.text;
  } catch (error) {
    console.error("AI image analysis failed:", error);
    return "画像の解析に失敗しました。もう一度試してください。";
  }
};
