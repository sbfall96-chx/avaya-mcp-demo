document.addEventListener("DOMContentLoaded", function() {
  // 1. Selector Elements
  const footprintSelect = document.getElementById("footprint-select");
  const agentSlider = document.getElementById("agent-slider");
  const agentVal = document.getElementById("agent-val");
  const spendSlider = document.getElementById("spend-slider");
  const spendVal = document.getElementById("spend-val");
  
  const capMcp = document.getElementById("cap-mcp");
  const capAgent = document.getElementById("cap-agent");
  const capLogging = document.getElementById("cap-logging");
  const capGov = document.getElementById("cap-gov");
  
  const capCardMcp = document.getElementById("cap-card-mcp");
  const capCardAgent = document.getElementById("cap-card-agent");
  const capCardLogging = document.getElementById("cap-card-logging");
  const capCardGov = document.getElementById("cap-card-gov");

  const kpiSavings = document.getElementById("kpi-savings");
  const kpiSavingsPercent = document.getElementById("kpi-savings-percentage");
  const kpiTimeline = document.getElementById("kpi-timeline");
  const kpiTimelineComp = document.getElementById("kpi-timeline-comparison");
  const kpiRisk = document.getElementById("kpi-risk");
  const kpiRiskDetail = document.getElementById("kpi-risk-detail");

  const printBtn = document.getElementById("print-brief-btn");
  const memoDate = document.getElementById("memo-date");
  const memoBody = document.getElementById("memo-body-content");

  // Format Date for Memo
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  memoDate.textContent = today.toLocaleDateString("en-US", options);

  // Print Action
  printBtn.addEventListener("click", () => {
    window.print();
  });

  // Toggle Card Active State Class
  const bindCardState = (checkbox, card) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
      calculateROI();
    });
  };
  bindCardState(capMcp, capCardMcp);
  bindCardState(capAgent, capCardAgent);
  bindCardState(capLogging, capCardLogging);
  bindCardState(capGov, capCardGov);

  // Slider Display Sync
  agentSlider.addEventListener("input", () => {
    agentVal.textContent = Number(agentSlider.value).toLocaleString();
    calculateROI();
  });
  spendSlider.addEventListener("input", () => {
    spendVal.textContent = Number(spendSlider.value).toLocaleString();
    calculateROI();
  });
  footprintSelect.addEventListener("change", calculateROI);

  // 2. Initialize ChartJS
  // Chart 1: One-Time Capex TCO comparison
  const ctxTco = document.getElementById('tcoChart').getContext('2d');
  const tcoChart = new Chart(ctxTco, {
    type: 'bar',
    data: {
      labels: ['Traditional Migration', 'Avaya Infinity Overlay'],
      datasets: [{
        label: 'Implementation & License Capex ($)',
        data: [0, 0],
        backgroundColor: [
          'rgba(218, 41, 28, 0.75)',  // Avaya Red for traditional/migration
          'rgba(0, 240, 255, 0.75)'   // Cyan for Infinity
        ],
        borderColor: [
          '#DA291C',
          '#00f0ff'
        ],
        borderWidth: 1.5,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#9ca3af', font: { family: 'JetBrains Mono', size: 9 } }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#f3f4f6', font: { family: 'Outfit', size: 10, weight: 'bold' } }
        }
      }
    }
  });

  // Chart 2: 3-Year Trend Comparison
  const ctxTrend = document.getElementById('trendChart').getContext('2d');
  const trendChart = new Chart(ctxTrend, {
    type: 'line',
    data: {
      labels: ['Year 1', 'Year 2', 'Year 3'],
      datasets: [
        {
          label: 'Traditional Cloud Migration',
          data: [0, 0, 0],
          borderColor: '#DA291C',
          backgroundColor: 'rgba(218, 41, 28, 0.05)',
          fill: true,
          tension: 0.25,
          borderWidth: 2,
          pointBackgroundColor: '#DA291C'
        },
        {
          label: 'Avaya Infinity Overlay',
          data: [0, 0, 0],
          borderColor: '#00f0ff',
          backgroundColor: 'rgba(0, 240, 255, 0.05)',
          fill: true,
          tension: 0.25,
          borderWidth: 2,
          pointBackgroundColor: '#00f0ff'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#9ca3af', font: { family: 'Outfit', size: 9 } }
        }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#9ca3af', font: { family: 'JetBrains Mono', size: 9 } }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#9ca3af', font: { family: 'Outfit', size: 10 } }
        }
      }
    }
  });

  // 3. Core ROI Calculation & Rendering Logic
  function calculateROI() {
    // Read input values
    const footprint = footprintSelect.value;
    const agents = parseInt(agentSlider.value);
    const annualSpend = parseInt(spendSlider.value);
    
    const hasMcp = capMcp.checked;
    const hasAgent = capAgent.checked;
    const hasLogging = capLogging.checked;
    const hasGov = capGov.checked;

    // A. TRADITIONAL CLOUD MIGRATION COST (e.g. Genesys/NICE rip-and-replace)
    // - Setup/custom wrappers: Base $90k + Sizing premium
    // - Consulting & configuration: $180 per agent
    // - Licensing: Sizing * $150/month * 12
    const migrationSetup = 90000 + (agents * 40);
    const migrationConsulting = agents * 220;
    const migrationLicensingAnnual = agents * 160 * 12;

    const migrationYear1 = migrationSetup + migrationConsulting + migrationLicensingAnnual;
    const migrationYear2 = migrationYear1 + migrationLicensingAnnual + (migrationSetup * 0.15); // Add maintenance
    const migrationYear3 = migrationYear2 + migrationLicensingAnnual + (migrationSetup * 0.15);

    // B. AVAYA INFINITY OVERLAY COST
    // - Base Platform: $20,000
    // - Setup (Unified bus, zero custom wrappers): Base $12,000 + Sizing $10/agent
    // - Overlay Consulting: $8,000
    // - Subscription (BYOAI Infinity seat): Sizing * $30/month * 12
    const infinitySetup = 12000 + (agents * 10);
    const infinityPlatformBase = 20000;
    const infinityConsulting = 8000;
    const infinityLicensingAnnual = agents * 30 * 12;

    // Overlay allows customer to retire their current support spend
    // We count the opex savings as a deduction against the net cost of the overlay
    const retiredOpexAnnual = annualSpend;

    const infinityYear1 = infinityPlatformBase + infinitySetup + infinityConsulting + infinityLicensingAnnual;
    const infinityYear2 = infinityYear1 + infinityLicensingAnnual + infinityPlatformBase;
    const infinityYear3 = infinityYear2 + infinityLicensingAnnual + infinityPlatformBase;

    // Net 3-Year totals
    const total3YearMigration = migrationYear3;
    const total3YearInfinity = infinityYear3 - (retiredOpexAnnual * 3); // Deduct retired opex
    
    // Net 3-Year savings (floored at 20k to avoid weird slider combos)
    const net3YearSavings = Math.max(20000, total3YearMigration - total3YearInfinity);
    const savingsPercentage = Math.round((net3YearSavings / total3YearMigration) * 100);

    // Timeline Sizing
    let timelineDays = 180;
    if (footprint === "cc-hybrid") timelineDays = 120;
    if (footprint === "axp-legacy") timelineDays = 90;
    
    // Risk Metrics
    let riskLevel = "Low Risk";
    let riskDetail = "Zero voice downtime, hybrid overlay";
    if (agents > 5000) {
      riskLevel = "Minimal Risk";
      riskDetail = "Phased visual orchestrations (Edify)";
    }

    // 4. Update DOM Scorecard
    kpiSavings.textContent = `$${Math.round(net3YearSavings).toLocaleString()}`;
    kpiSavingsPercent.textContent = `${savingsPercentage}% lower 3-year TCO`;
    
    kpiTimeline.textContent = "2 Hours";
    kpiTimelineComp.textContent = `vs. ${timelineDays}-day cloud migration`;
    
    kpiRisk.textContent = riskLevel;
    kpiRiskDetail.textContent = riskDetail;

    // 5. Update Charts
    tcoChart.data.datasets[0].data = [migrationYear1, (infinityPlatformBase + infinitySetup + infinityConsulting + infinityLicensingAnnual)];
    tcoChart.update();

    trendChart.data.datasets[0].data = [migrationYear1, migrationYear2, migrationYear3];
    trendChart.data.datasets[1].data = [
      Math.max(0, infinityYear1 - retiredOpexAnnual), 
      Math.max(0, infinityYear2 - (retiredOpexAnnual * 2)), 
      Math.max(0, total3YearInfinity)
    ];
    trendChart.update();

    // 6. Generate Dynamic Executive Brief Memo
    let footprintName = "Avaya Aura/Elite On-Premises";
    if (footprint === "cc-hybrid") footprintName = "Avaya Hybrid Contact Center";
    if (footprint === "axp-legacy") footprintName = "Avaya Experience Platform Legacy Cloud";

    let capBullets = "";
    if (hasMcp) capBullets += "<li><strong>Unified MCP Bus:</strong> Standardized broker layer eliminates spaghetti integrations to CRM and database silos.</li>";
    if (hasAgent) capBullets += "<li><strong>Agent Assist AI:</strong> Real-time call parsing, translation, and prompt assist overlay.</li>";
    if (hasLogging) capBullets += "<li><strong>Automated CRM Logging:</strong> Reduces manual wrap-up times, increasing agent availability.</li>";
    if (hasGov) capBullets += "<li><strong>Databricks PII Masking:</strong> Local proxy layer masks sensitive data prior to cloud transit, ensuring HIPAA compliance.</li>";

    memoBody.innerHTML = `
      <p>
        This value brief evaluates the strategic and financial implications of modernizing the enterprise's current 
        <strong>${footprintName}</strong> infrastructure. Our model scales for <strong>${agents.toLocaleString()} active agents</strong> 
        with an audited annual IT support spend of <strong>$${annualSpend.toLocaleString()}</strong>.
      </p>
      <p>
        Instead of undergoing a traditional, high-risk "rip-and-replace" cloud migration that forces the rewriting of dial plans 
        and network paths over a <strong>${timelineDays}-day cycle</strong>, we propose deploying the <strong>Avaya Infinity Overlay Upgrade</strong>. 
        Infinity integrates directly with your existing voice core via Model Context Protocol (MCP) standards. This architecture introduces 
        state-of-the-art AI capabilities while retaining 100% voice reliability.
      </p>
      
      <h3>Selected AI & Integration Upgrades:</h3>
      <ul class="list-view-des" style="margin-left: 20px; list-style-type: disc; padding-left: 10px; font-size: 0.85rem; display: flex; flex-direction: column; gap: 6px;">
        ${capBullets || "<li>No upgrade capabilities currently selected.</li>"}
      </ul>

      <h3>Financial Summary (3-Year TCO Comparison)</h3>
      <table class="memo-table">
        <thead>
          <tr>
            <th>Cost Element</th>
            <th>Traditional Cloud Migration</th>
            <th>Avaya Infinity Overlay</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Implementation & Setup (CapEx)</td>
            <td>$${Math.round(migrationSetup + migrationConsulting).toLocaleString()}</td>
            <td>$${Math.round(infinitySetup + infinityConsulting).toLocaleString()}</td>
          </tr>
          <tr>
            <td>Annual Subscriptions (OpEx)</td>
            <td>$${Math.round(migrationLicensingAnnual * 3).toLocaleString()} <span style="font-size: 0.7em; color: #666;">(3 yrs)</span></td>
            <td>$${Math.round(infinityLicensingAnnual * 3 + (infinityPlatformBase * 3)).toLocaleString()} <span style="font-size: 0.7em; color: #666;">(3 yrs)</span></td>
          </tr>
          <tr>
            <td>Retired Legacy Support Opex</td>
            <td>$0</td>
            <td style="color: #10b981;">-$${Math.round(retiredOpexAnnual * 3).toLocaleString()} <span style="font-size: 0.7em; color: #10b981;">(Retired)</span></td>
          </tr>
          <tr class="total-row">
            <td>Net 3-Year Total TCO</td>
            <td>$${Math.round(total3YearMigration).toLocaleString()}</td>
            <td style="color: #0088cc;">$${Math.round(total3YearInfinity).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>Business Outcome & ROI:</strong> By choosing the Avaya Infinity overlay, the organization achieves a net 3-year TCO savings of 
        <strong style="color: #10b981;">$${Math.round(net3YearSavings).toLocaleString()} (${savingsPercentage}% savings)</strong>. 
        Crucially, because the setup operates as a hybrid overlay, implementation is cut to **2 hours** with **zero voice downtime**, 
        completely eliminating the operational disruption and security exposure of a full-scale cloud migration.
      </p>
    `;
  }

  // 7. Initial Run
  calculateROI();
});
