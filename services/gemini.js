const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateText(prompt) {
    const response = await ai.models.generateContent({
       model: "gemini-flash-latest",
        contents: prompt,
    });

    return response.text;
}

module.exports = {
    generateText,
};