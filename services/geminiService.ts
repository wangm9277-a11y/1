import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TcmCase } from "../types";
import { MOCK_FALLBACK_CASE } from "../constants";

const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("API_KEY not found in environment. Using mock data fallback.");
    return "";
  }
  return key;
};

// Define the schema for structured output
const tcmCaseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    patientName: { type: Type.STRING },
    appearance: {
      type: Type.OBJECT,
      properties: {
        face: { type: Type.STRING, description: "Description of face color/expression (e.g. 面色潮红)" },
        tongue: { type: Type.STRING, description: "Description of tongue body and coating (e.g. 舌红苔黄腻)" },
        pulse: { type: Type.STRING, description: "Description of pulse type (e.g. 脉滑数)" },
      },
      required: ["face", "tongue", "pulse"],
    },
    complaint: { type: Type.STRING, description: "First person complaint from patient (e.g. '我感觉...')" },
    correctDiagnosis: { type: Type.STRING, description: "The correct TCM Syndrome Differentiation (e.g. 肝胆湿热证)" },
    wrongOptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 plausible but incorrect diagnoses",
    },
    explanation: { type: Type.STRING, description: "Short explanation of why the diagnosis is correct based on symptoms." },
  },
  required: ["patientName", "appearance", "complaint", "correctDiagnosis", "wrongOptions", "explanation"],
};

export const generateTcmCase = async (): Promise<TcmCase> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    // Simulate network delay for mock
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return MOCK_FALLBACK_CASE;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "生成一个中医执业医师考试水平的临床接诊病例。包括病人主诉、面色、舌象、脉象。提供一个正确的辨证诊断和三个错误的干扰项。所有内容用中文。",
      config: {
        responseMimeType: "application/json",
        responseSchema: tcmCaseSchema,
        systemInstruction: "You are a senior TCM professor designing exam questions. Generate realistic, distinct clinical cases. Ensure the 'wrongOptions' are related enough to be confusing for a student but clearly incorrect based on the signs.",
        temperature: 1.0, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as TcmCase;
    } else {
      throw new Error("No text response from Gemini");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return MOCK_FALLBACK_CASE;
  }
};
