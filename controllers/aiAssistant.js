const { generateText } = require("../services/gemini");

module.exports.askAssistant = async (req, res) => {

    console.log("===== AI Assistant Route Hit =====");
console.log(req.body);

    try {

        const { question, history = [] } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a question."
            });
        }

        const formattedHistory = history
    .map(chat => `${chat.role.toUpperCase()}: ${chat.message}`)
    .join("\n");

        const prompt = `
You are Wanderlust AI Travel Assistant.

You ONLY answer travel-related questions.

Allowed topics:
- Tourist destinations
- Hotels
- Homestays
- Flights
- Trains
- Buses
- Local transport
- Restaurants
- Local food
- Weather
- Budget
- Packing tips
- Safety
- Local culture
- Best time to visit
- Itineraries
- Visa (general guidance)
- Travel tips

If the user's question is NOT related to travel, tourism, destinations, hotels, transportation, food, weather, itineraries or vacations, DO NOT answer it.

Instead reply EXACTLY:

❌ Sorry! I can only help with travel-related questions.

Please ask about:

🏖️ Tourist Destinations
🏨 Hotels & Homestays
🍽️ Food & Restaurants
✈️ Flights & Transport
💰 Budget Planning
🧳 Packing Tips
📅 Best Time to Visit

------------------------------------

RESPONSE FORMAT (STRICTLY FOLLOW)

- Never write paragraphs.
- Always use headings with emojis.
- Always use bullet points.
- Maximum 6 bullet points.
- Maximum 80 words.
- Each bullet should be one short sentence.
- End every answer with one travel tip beginning with:
💡 Tip:

Example:

🍽️ Local Food

• Fish Curry
• Prawn Balchão
• Chicken Xacuti
• Bebinca

💡 Tip: Try local family-run restaurants for authentic taste.



Conversation History:

${formattedHistory}


Current User Question:

${question}
`;
        const answer = await generateText(prompt);

        res.json({
            success: true,
            answer,
        });

    } catch (err) {

        console.error("AI Assistant Error:", err);

       res.status(500).json({
    success: false,
    message: err.message
});
    }

};