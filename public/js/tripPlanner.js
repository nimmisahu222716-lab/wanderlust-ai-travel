const generateTripBtn = document.getElementById("generateTrip");
const downloadBtn = document.getElementById("downloadPDF");
let latestTrip = null;

generateTripBtn.addEventListener("click", async () => {

    const destination = document.getElementById("destination").value.trim();
    const month = document.getElementById("month").value;
    const days = document.getElementById("days").value;
    const budget = document.getElementById("budget").value;
    const style = document.getElementById("style").value;
    const travelers = document.getElementById("travelers").value;

    if (
        !destination ||
        !month ||
        !days ||
        !budget ||
        !style ||
        !travelers
    ) {
        alert("Please fill all fields.");
        return;
    }

    generateTripBtn.disabled = true;
    generateTripBtn.innerText = "Generating Trip...";

    try {

        const response = await fetch("/trip-planner/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                destination,
                month,
                days,
                budget,
                style,
                travelers,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

       const trip = JSON.parse(data.tripPlan);
       latestTrip = trip;
       downloadBtn.style.display = "inline-block";

const dayCards = trip.days.map(day => {

    const activities = day.activities.map(activity => `
        <li class="list-group-item border-0 ps-0">
            ✅ ${activity}
        </li>
    `).join("");

    return `
        <div class="card mt-3 shadow-sm border-0 rounded-4">

            <div class="card-body">

                <h4 class="mb-3">
                    📅 Day ${day.day}
                </h4>

                <ul class="list-group list-group-flush">

                    ${activities}

                </ul>

            </div>

        </div>
    `;

}).join("");

const budgetHTML = `
<div class="card mt-3 shadow-sm border-0 rounded-4">

    <div class="card-body">

        <h4>💰 Budget Breakdown</h4>

        <ul class="list-group list-group-flush">

            <li class="list-group-item">
                🏨 Accommodation : ${trip.budgetBreakdown.accommodation}
            </li>

            <li class="list-group-item">
                🍽 Food : ${trip.budgetBreakdown.food}
            </li>

            <li class="list-group-item">
                🚗 Transport : ${trip.budgetBreakdown.transport}
            </li>

            <li class="list-group-item">
                🎟 Activities : ${trip.budgetBreakdown.activities}
            </li>

        </ul>

    </div>

</div>
`;

const foodHTML = `
<div class="card mt-3 shadow-sm border-0 rounded-4">

    <div class="card-body">

        <h4>🍛 Local Food</h4>

        <ul class="list-group list-group-flush">

            ${trip.localFood.map(food => `
                <li class="list-group-item">
                    🍽 ${food}
                </li>
            `).join("")}

        </ul>

    </div>

</div>
`;

const tipsHTML = `
<div class="card mt-3 shadow-sm border-0 rounded-4">

    <div class="card-body">

        <h4>💡 Travel Tips</h4>

        <ul class="list-group list-group-flush">

            ${trip.travelTips.map(tip => `
                <li class="list-group-item">
                    ✅ ${tip}
                </li>
            `).join("")}

        </ul>

    </div>

</div>
`;

document.getElementById("tripResult").innerHTML = `
    <div class="card shadow-sm border-0 rounded-4">

        <div class="card-body">

            <h2 class="mb-2">
                🧳 ${trip.title}
            </h2>

            <p class="text-muted mb-0">
                📍 ${trip.destination}
            </p>

            <p class="text-muted">
                📅 ${trip.month}
            </p>

        </div>

    </div>

   ${dayCards}

${budgetHTML}

${foodHTML}

${tipsHTML}
`;

    } catch (err) {

        alert(err.message);

    } finally {

        generateTripBtn.disabled = false;
        generateTripBtn.innerText = "✨ Generate Trip Plan";

    }

});

downloadBtn.addEventListener("click", () => {

    if (!latestTrip) {
        alert("Generate a trip first.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;

    function addLine(text, size = 12, gap = 8) {

        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(size);
        doc.text(text, 15, y);

        y += gap;
    }

    addLine(latestTrip.title, 18, 12);

    addLine(`Destination: ${latestTrip.destination}`);
    addLine(`Travel Month: ${latestTrip.month}`);

    y += 4;

    latestTrip.days.forEach(day => {

        addLine(`Day ${day.day}`, 15, 10);

        day.activities.forEach(activity => {
            addLine(`• ${activity}`, 11, 7);
        });

        y += 4;

    });

    addLine("Budget Breakdown", 15, 10);

    addLine(`Accommodation: ${latestTrip.budgetBreakdown.accommodation}`);
    addLine(`Food: ${latestTrip.budgetBreakdown.food}`);
    addLine(`Transport: ${latestTrip.budgetBreakdown.transport}`);
    addLine(`Activities: ${latestTrip.budgetBreakdown.activities}`);

    y += 6;

    addLine("Local Food", 15, 10);

    latestTrip.localFood.forEach(food => {
        addLine(`• ${food}`, 11, 7);
    });

    y += 6;

    addLine("Travel Tips", 15, 10);

    latestTrip.travelTips.forEach(tip => {
        addLine(`• ${tip}`, 11, 7);
    });

    doc.save(`${latestTrip.destination}-Trip-Plan.pdf`);

});