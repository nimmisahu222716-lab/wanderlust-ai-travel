const { generateText } = require("../services/gemini");

module.exports.generateTrip = async (req, res) => {

    try {

        let {
            destination,
            month,
            days,
            budget,
            style,
            travelers,
        } = req.body;

        destination = destination?.trim();
        month = month?.trim();
        style = style?.trim();

        if (
            !destination ||
            !month ||
            !days ||
            !budget ||
            !style ||
            !travelers
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }

        const prompt = `
You are an expert travel planner.

Generate a travel itinerary in VALID JSON only.

Do NOT include markdown.
Do NOT include explanations.
Do NOT include \`\`\`json.
Return ONLY valid JSON.

Use this exact structure:

{
  "title": "",
  "destination": "",
  "month": "",
  "days": [
    {
      "day": 1,
      "activities": [
        "",
        "",
        ""
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": "",
    "food": "",
    "transport": "",
    "activities": ""
  },
  "localFood": [
    "",
    ""
  ],
  "travelTips": [
    "",
    ""
  ]
}

Trip Details

Destination: ${destination}

Travel Month: ${month}

Duration: ${days} days

Budget: ₹${budget}

Travel Style: ${style}

Travelers: ${travelers}

Requirements:

- Budget must be realistic.
- Include one object per day.
- Include 3–5 activities each day.
- Include local food recommendations.
- Include useful travel tips.
`;
        const tripPlan = await generateText(prompt);

        res.json({
            success: true,
            tripPlan,
        });

    } catch (err) {

        console.error("Trip Planner Error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to generate trip plan."
        });

    }

};