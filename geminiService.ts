
import { GoogleGenAI, Type } from "@google/genai";
import { StaffTask, ManagementSummary } from "../types";

export const analyzeTasks = async (tasks: StaffTask[]): Promise<ManagementSummary> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    You are an operations assistant reviewing a hierarchical task board for Cloudcrave Solutions.
    
    Data:
    ${JSON.stringify(tasks, null, 2)}
    
    Current Date Reference: Nov 20, 2024
    
    INSTRUCTIONS:
    1. Group tasks by Task Owner (staffName).
    2. Analyze productivity based on "hoursSpent".
    3. Calculate total hours by cadence (Daily, Weekly, Monthly, N/A).
    4. Maintain a professional, neutral tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            staffWorkload: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  staffName: { type: Type.STRING },
                  oneTimeTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recurringTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  trainingTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  currentlyWorkingOn: { type: Type.STRING },
                  unresolvedItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                  totalHours: { type: Type.NUMBER },
                  effortByFrequency: {
                    type: Type.OBJECT,
                    properties: {
                      daily: { type: Type.NUMBER },
                      weekly: { type: Type.NUMBER },
                      monthly: { type: Type.NUMBER },
                      oneTime: { type: Type.NUMBER }
                    },
                    required: ["daily", "weekly", "monthly", "oneTime"]
                  }
                },
                required: ["staffName", "oneTimeTasks", "recurringTasks", "trainingTasks", "currentlyWorkingOn", "unresolvedItems", "totalHours", "effortByFrequency"]
              }
            },
            recurringTaskOverview: { type: Type.STRING },
            trainingOverview: { type: Type.STRING },
            blockersAndRisks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskTitle: { type: Type.STRING },
                  owner: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["taskTitle", "owner", "reason"]
              }
            },
            analytics: {
              type: Type.OBJECT,
              properties: {
                totalTasks: { type: Type.NUMBER },
                blockedCount: { type: Type.NUMBER },
                overdueCount: { type: Type.NUMBER },
                completionPercentage: { type: Type.NUMBER },
                totalHoursLogged: { type: Type.NUMBER },
                cadenceBreakdown: {
                  type: Type.OBJECT,
                  properties: {
                    dailyTotal: { type: Type.NUMBER },
                    weeklyTotal: { type: Type.NUMBER },
                    monthlyTotal: { type: Type.NUMBER },
                    oneTimeTotal: { type: Type.NUMBER }
                  },
                  required: ["dailyTotal", "weeklyTotal", "monthlyTotal", "oneTimeTotal"]
                }
              },
              required: ["totalTasks", "blockedCount", "overdueCount", "completionPercentage", "totalHoursLogged", "cadenceBreakdown"]
            }
          },
          required: ["executiveSummary", "staffWorkload", "recurringTaskOverview", "trainingOverview", "blockersAndRisks", "analytics"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No textual response received from the analysis model.");
    }
    return JSON.parse(text.trim());
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Gemini Analysis Error:", error.message);
    throw new Error(error.message || "Failed to communicate with AI model.");
  }
};
