import { GoogleGenAI, Type } from "@google/genai";
import { MnemonicResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMnemonic = async (num1: number, num2: number, product: number): Promise<MnemonicResponse> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      为小学生（6-9岁）生成一个九九乘法表算式 ${num1} x ${num2} = ${product} 的趣味记忆法。
      
      要求：
      1. "rhyme": 一个简短顺口的中文口诀或顺口溜（20字以内，有趣好记）。
      2. "visualCue": 一个联想记忆的画面描述（例如：“把8想象成雪人”，“7像一把镰刀”）。
      3. "emojis": 3-5个相关的Emoji表情。

      语气要可爱、鼓励性强，适合儿童。
      如果是简单的题目（如 1x1, 2x2），给一句简单的夸奖或超级简单的联想即可。
      只返回 JSON 格式。
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rhyme: { type: Type.STRING },
            visualCue: { type: Type.STRING },
            emojis: { type: Type.STRING },
          },
          required: ["rhyme", "visualCue", "emojis"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as MnemonicResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if AI fails (Chinese)
    return {
      rhyme: `${num1} 乘 ${num2} 等于 ${product}，你真棒！`,
      visualCue: "想象数字在跳舞！",
      emojis: "🔢✨🎈"
    };
  }
};