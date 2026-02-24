// Submit Report
const form = document.getElementById("reportForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            city: document.getElementById("city").value,
            temperature: Number(document.getElementById("temperature").value),
            rainfall: Number(document.getElementById("rainfall").value),
            windSpeed: Number(document.getElementById("windSpeed").value),
            humidity: Number(document.getElementById("humidity").value)
        };

        const res = await fetch("/api/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        document.getElementById("responseMsg").innerText =
            `Risk: ${result.risk} | Severity: ${result.severity}`;
    });
}

// Load Alerts
async function loadAlerts() {
    const res = await fetch("/api/alerts");
    const alerts = await res.json();

    const container = document.getElementById("alertsList") || document.getElementById("alertContainer");
    if (!container) return;

    container.innerHTML = "";

    alerts.forEach(alert => {
        const div = document.createElement("div");
        div.className = "card " + alert.severity.toLowerCase();
        div.innerHTML = `
            <h3>${alert.alertType}</h3>
            <p>City: ${alert.reportId.city}</p>
            <p>Risk: ${alert.riskIndex.toFixed(2)}</p>
            <p>Severity: ${alert.severity}</p>
        `;
        container.appendChild(div);
        if (document.getElementById("totalAlerts")) {
    document.getElementById("totalAlerts").innerText =
        "Total Alerts: " + alerts.length;
}
    });
}

loadAlerts();