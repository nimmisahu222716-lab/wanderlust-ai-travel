const generateBtn = document.getElementById("generateAI");
const improveBtn = document.getElementById("improveAI");
const regenerateBtn = document.getElementById("regenerateAI");
const statusText = document.getElementById("aiStatus");

async function generateDescription(isImprove = false) {

    const title = document.getElementById("title").value.trim();
    const location = document.getElementById("location").value.trim();
    const country = document.getElementById("country").value.trim();
    const category = document.getElementById("category").value;
    const tone = document.getElementById("tone").value;
    const description = document.getElementById("description").value.trim();

    if (!title || !location || !country || !category) {
        alert("Please fill Title, Location, Country and Category first.");
        return;
    }

    if (isImprove && !description) {
        alert("Please write a description first.");
        return;
    }

    generateBtn.disabled = true;
improveBtn.disabled = true;

if (regenerateBtn) {
    regenerateBtn.disabled = true;
}

    statusText.innerText = isImprove
        ? "Improving description..."
        : "Generating description...";

    try {

        const response = await fetch(
            isImprove
                ? "/ai/improve-description"
                : "/ai/generate-description",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
    title,
    location,
    country,
    category,
    tone,
    description,
}),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong.");
        }

        document.getElementById("description").value = data.description;

        statusText.innerText = isImprove
            ? "✨ Description improved successfully."
            : "✨ Description generated successfully.";

    } catch (err) {

        console.error(err);

        statusText.innerText = err.message;

    } finally {

       generateBtn.disabled = false;
improveBtn.disabled = false;

if (regenerateBtn) {
    regenerateBtn.disabled = false;
}

    }

}

generateBtn.addEventListener("click", () => generateDescription(false));

improveBtn.addEventListener("click", () => generateDescription(true));

if (regenerateBtn) {
    regenerateBtn.addEventListener("click", () => {
        generateDescription(false);
    });
}