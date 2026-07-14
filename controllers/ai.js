const { generateText } = require("../services/gemini");

// ================================
// Generate New Description
// ================================
module.exports.generateDescription = async (req, res) => {
    try {
        let {
    title,
    location,
    country,
    category,
    tone,
} = req.body;

        // Trim inputs
        title = title?.trim();
        location = location?.trim();
        country = country?.trim();
        category = category?.trim();
        tone = tone?.trim() || "Professional";

        // Validation
        if (!title || !location || !country || !category) {
            return res.status(400).json({
                success: false,
                message: "Please fill Title, Location, Country and Category."
            });
        }

        if (
            title.length > 100 ||
            location.length > 100 ||
            country.length > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Input is too long."
            });
        }

        const prompt = `
You are an experienced Airbnb content writer.

Write an engaging property description.

Property Details:

Title: ${title}

Location: ${location}

Country: ${country}

Category: ${category}

Writing Style: ${tone}

Rules:

- Write in a ${tone} style.
- Write between 80 and 120 words.
- Friendly and professional tone.
- Mention the location naturally.
- Highlight the category naturally.
- Do not invent facilities.
- Do not use markdown.
- Do not use emojis.
- Return only one paragraph.
`;

        const description = await generateText(prompt);

        return res.json({
            success: true,
            description
        });

    } catch (err) {

        console.error("Gemini Generate Error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to generate description."
        });

    }
};


// ================================
// Improve Existing Description
// ================================
module.exports.improveDescription = async (req, res) => {

    try {

        let {
    description,
    title,
    category,
    tone,
} = req.body;

        description = description?.trim();
        title = title?.trim();
        category = category?.trim();
        tone = tone?.trim() || "Professional";

        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Description is required."
            });
        }

        if (description.length > 2500) {
            return res.status(400).json({
                success: false,
                message: "Description is too long."
            });
        }

        const prompt = `
You are an experienced Airbnb content editor.

Improve the following property description.

Title:
${title}

Category:
${category}

Writing Style:
${tone}

Original Description:
${description}

Rules:

- Rewrite the description in a ${tone} style.
- Keep the meaning same.
- Improve grammar.
- Improve readability.
- Make it attractive.
- Do not invent facilities.
- Do not use markdown.
- Do not use emojis.
- Return only the improved paragraph.
`;

        const improvedDescription = await generateText(prompt);

        return res.json({
            success: true,
            description: improvedDescription
        });

    } catch (err) {

        console.error("Gemini Improve Error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to improve description."
        });

    }

};