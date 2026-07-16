
const askBtn = document.getElementById("askAI");
const chatBox = document.getElementById("chatBox");
const questionInput = document.getElementById("question");


let conversationHistory = [];

function addUserMessage(message) {

    chatBox.innerHTML += `
        <div class="d-flex justify-content-end mb-3">

            <div
                class="bg-dark text-white rounded-4 p-3"
                style="max-width:75%;">

                ${message}

            </div>

        </div>
    `;

   chatBox.scrollTop = chatBox.scrollHeight;

conversationHistory.push({
    role: "user",
    message: message
});

if (conversationHistory.length > 10) {
    conversationHistory.shift();
}

}

function addThinkingMessage() {

    const id = "thinking-" + Date.now();

    chatBox.innerHTML += `
        <div class="d-flex justify-content-start mb-3">

            <div
                id="${id}"
                class="bg-white shadow-sm rounded-4 p-3"
                style="max-width:75%;">

                🤖 Thinking...

            </div>

        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    return id;
}

function replaceThinking(id, answer) {

    answer = answer
        .replace(/\n/g, "<br>")
        .replace(/•/g, "<br>• ");

    document.getElementById(id).innerHTML = `
        <div class="fw-bold mb-2">
            🤖 Wanderlust AI
        </div>

        <div style="line-height:1.8;">
            ${answer}
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

   conversationHistory.push({
    role: "assistant",
    message: answer
});

if (conversationHistory.length > 10) {
    conversationHistory.shift();
}

}

askBtn.addEventListener("click", async () => {

    const question = questionInput.value.trim();

    if (!question) {
        alert("Please enter a travel question.");
        return;
    }

    addUserMessage(question);

    questionInput.value = "";

    askBtn.disabled = true;

    const thinkingId = addThinkingMessage();

    try {

        const response = await fetch("/ai-assistant/ask", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
    question,
    history: conversationHistory
})

        });

        window.addEventListener("beforeunload", () => {
    conversationHistory = [];
});

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        replaceThinking(thinkingId, data.answer);

    } catch (err) {

        replaceThinking(
            thinkingId,
            "❌ " + err.message
        );

    } finally {

        askBtn.disabled = false;

    }

});

window.addEventListener("beforeunload", () => {
    conversationHistory = [];
});


