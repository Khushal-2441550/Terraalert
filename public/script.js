// Submit Report
const form = document.getElementById("reportForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const reportId = document.getElementById("reportId").value;
        const data = {
            city: document.getElementById("city").value,
            pincode: document.getElementById("pincode").value,
            temperature: Number(document.getElementById("temperature").value),
            rainfall: Number(document.getElementById("rainfall").value),
            windSpeed: Number(document.getElementById("windSpeed").value),
            humidity: Number(document.getElementById("humidity").value)
        };

        let method = "POST";
        let url = "/api/reports";

        if (reportId) {
            method = "PUT";
            url = `/api/reports/${reportId}`;
        }

        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        document.getElementById("responseMsg").innerText =
            `Risk: ${result.risk} | Severity: ${result.severity}`;

        // Reset form
        form.reset();
        document.getElementById("reportId").value = "";
        document.getElementById("submitBtn").innerText = "Submit Report";

        loadReports(); // Refresh the list
        loadAlerts(); // Refresh alerts
    });
}

// Load Reports for Management
async function loadReports() {
    const container = document.getElementById("reportsList");
    if (!container) return; // Only process if on the manage page

    const res = await fetch("/api/reports");
    const reports = await res.json();

    container.innerHTML = "";

    reports.forEach(report => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h3>${report.city} (${report.pincode})</h3>
            <p>Temp: ${report.temperature}°C, Rain: ${report.rainfall}mm</p>
            <p>Wind: ${report.windSpeed}km/h, Humid: ${report.humidity}%</p>
            <button class="edit-btn" style="margin-top: 10px; padding: 5px; background: #f39c12; color: #fff; border: none; border-radius: 3px; cursor: pointer;">Edit</button>
            <button class="delete-btn" style="margin-top: 10px; padding: 5px; background: #e74c3c; color: #fff; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
        `;

        div.querySelector(".edit-btn").onclick = () => editReport(report);
        div.querySelector(".delete-btn").onclick = () => deleteReport(report._id);

        container.appendChild(div);
    });
}

// Edit Report - Populates Form
function editReport(report) {
    document.getElementById("reportId").value = report._id;
    document.getElementById("city").value = report.city;
    document.getElementById("pincode").value = report.pincode;
    document.getElementById("temperature").value = report.temperature;
    document.getElementById("rainfall").value = report.rainfall;
    document.getElementById("windSpeed").value = report.windSpeed;
    document.getElementById("humidity").value = report.humidity;

    document.getElementById("submitBtn").innerText = "Update Report";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete Report
async function deleteReport(id) {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
        const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
        const result = await res.json();
        alert(result.message);
        loadReports();
        loadAlerts(); // Refresh alerts list if applicable
    } catch (err) {
        console.error("Failed to delete report:", err);
    }
}

// Make functions global for debug or other uses if needed
window.editReport = editReport;
window.deleteReport = deleteReport;

if (document.getElementById("reportsList")) {
    loadReports();
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
        div.style.cursor = "pointer";
        div.onclick = () => window.location.href = `map.html?alertId=${alert._id}`;
        div.innerHTML = `
            <h3>${alert.alertType}</h3>
            <p>City: ${alert.reportId?.city} (${alert.reportId?.pincode})</p>
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

// Initial check for visibility on load
function checkCardVisibility() {
    const container = document.querySelector(".card-container");
    if (!container) return;

    // Always make it visible on load for Dashboard since it's at the top
    container.classList.add("visible");
}

window.onload = checkCardVisibility;

window.addEventListener("scroll", () => {
    const container = document.querySelector(".card-container");
    if (!container) return;

    const trigger = window.innerHeight * 0.85;

    if (container.getBoundingClientRect().top < trigger) {
        container.classList.add("visible");
    }
});

// Search functionality
const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
        const query = document.getElementById("searchInput").value;
        if (!query) return;

        try {
            const res = await fetch(`/api/reports/search/${query}`);
            const reports = await res.json();
            const searchResult = document.getElementById("searchResult");

            if (reports.length > 0) {
                const report = reports[0];
                searchResult.innerHTML = `
                    <div class="card" style="margin: 0 auto; text-align: left; max-width: 600px;">
                        <h3>Report for ${report.city} (${report.pincode})</h3>
                        <p>Temperature: ${report.temperature}°C</p>
                        <p>Rainfall: ${report.rainfall} mm</p>
                        <p>Wind Speed: ${report.windSpeed} km/h</p>
                        <p>Humidity: ${report.humidity}%</p>
                    </div>
                `;
            } else {
                searchResult.innerHTML = `<p style="color: white; text-align: center;">No reports found for "${query}".</p>`;
            }
        } catch (err) {
            console.error("Error searching:", err);
        }
    });
}