const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateText(prompt) {

    const MAX_RETRIES = 2;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

        try {

            const response = await ai.models.generateContent({
                model: "gemini-flash-latest",
                contents: prompt,
            });

            return response.text;

        } catch (err) {

            // Retry only if Gemini is temporarily unavailable
            if (err.status === 503 && attempt < MAX_RETRIES) {

                console.log(`Gemini busy... Retrying (${attempt}/${MAX_RETRIES})`);

                await delay(2000);

                continue;
            }

            throw err;
        }
    }
}

module.exports = {
    generateText,
};