# Avaya Infinity MCP – Secure AI Orchestration & Analytics Control Center

This repository houses a high-fidelity frontend prototype illustrating **Avaya Infinity's Model Context Protocol (MCP)** implementation, integrated with **Databricks Unity Catalog** for secure, audited communications routing and compliance. 

This interactive console demonstrates how Avaya's FY26 architecture moves beyond traditional contact centers to **connection orchestration**, replacing legacy custom integrations ($N \times M$ connections) with a clean, standardized AI bus ($N + M$ open connections).

---

## 🌟 Key Features

### 1. Agentic AI & BYOAI Brains
* **AI-Agnostic Routing:** Dynamically swap active AI brains (Gemini 1.5, Claude 3.5, GPT-4o) directly in the UI.
* **Simulated & Live Modes:** Supports both offline mock scenario processing (perfect for presentations in areas with spotty connection) and **Live Gemini API mode** (which executes real tool calling against live APIs).
* **Live Protocol Trace:** Inspect the step-by-step MCP JSON payloads, schemas, and return arguments exchanged between the model client and database servers.

### 2. Databricks Enterprise Governance (Zero-Trust)
* **PII Data Masking (HIPAA Compliance):** Toggle PII masking ON to automatically redact customer names to a standardized fixed-length mask (`J*** E***`) in trace headers, JSON payloads, local database views, and final chat bubbles.
* **Role-Based Access Control (RBAC):** Toggle Restricted Access ON to witness Databricks Unity Catalog automatically block unauthorized SQL calls with a `403 Permission Denied` security exception.
* **Live Governance Compliance Summary:** Displays live running counters for PII items masked, blocked requests, and compliance SLA status (100% healthy, degrades if policy breaches occur).

### 3. Sales Outcomes & Financial ROI Metrics
* **Architecture Playground ROI Panel:** Interactive N x M vs N + M topology selector that compares Legacy integration costs ($150,000/yr TCO, 4-month deployments) against Avaya Infinity standardized bus ($15,000/yr TCO, 2-hour deployments).
* **Aura AI Business Outcome Banners:** Renders a visual green summary card at the bottom of resolved customer issues detailing exact ARR retained ($24k for VIP escalations, $8.4k for cancellations), SLA fines avoided, and CSAT scores achieved.
* **Tandem Care (Human-in-the-Loop):** An automated workflow checkpoint that requests supervisor authorization before making high-stakes updates to CRM priorities.

### 4. Interactive Data Silos
* **Edify Journey Orchestrator:** An interactive, animated flowchart visualization of active voice, chat, and AI-triage routing packets.
* **Unified Lakehouse Viewer:** Instantly inspect mock PostgreSQL call logs, Zendesk CRM profiles, and SharePoint Knowledge Base SOP documents.

---

## 📂 Presentation & Sales Pitch Assets

We have compiled professional business-case documentation and slide decks directly inside the workspace folder for presentations to sales leadership (Carlos) and customer stakeholders:

1. **[Avaya_Infinity_MCP_Pitch_Deck.pptx](file:///c:/Users/sbfal/OneDrive/Desktop/work/Avaya_Infinity_MCP_Pitch_Deck.pptx)**: A premium 5-slide PowerPoint deck analyzing:
   * Spaghetti custom integrations ($N \times M$) vs the MCP Standard ($N + M$).
   * TCO reduction by 90% ($15,000/yr vs $150,000/yr).
   * Databricks zero-trust compliance, HIPAA PII masking, and RBAC gatekeeping.
   * Quantifiable business case outcomes for Queue Spikes, VIP Routing, and Contract Churn.
2. **[Avaya_Infinity_MCP_Executive_Brief.pdf](file:///c:/Users/sbfal/OneDrive/Desktop/work/Avaya_Infinity_MCP_Executive_Brief.pdf)**: A publication-quality executive summary PDF brief detailing TCO metrics, governance checkpoints, and financial ROI models.

---

## 🚀 Step-by-Step Demo Guide (For Presenting)

Use this exact scenario script to demonstrate the prototype's reasoning, compliance, and financial outcome capabilities to sales leadership:

### Phase 1: Zero-Trust HIPAA Governance
1. Open the settings (gear icon) and toggle **`PII Data Masking (HIPAA)`** to **ON**, then click **Save Configurations**.
2. Navigate to **Unified Lakehouse & Silos** tab. Show how name records are auto-masked to `J*** E***`.
3. In the chat console, run the **VIP CRM Escalation** preset. 
4. Check the **Databricks Governance Log** tab to verify that the compliance audit trails were logged and archived securely, and notice the **PII Masked** counter has incremented in the Compliance Audit Summary panel.
5. In Settings, toggle **Restrict Call DB Access** to **ON**. Trigger a query; show how the system blocks unauthorized tool access, yields a 403 Security Exception, and increments the **Blocked Requests** compliance counter.

### Phase 2: Showcasing Sales Outcomes & TCO
1. Go to the **Architecture Playground** tab. 
2. Show Carlos the N x M vs N + M topology. Toggle between **Legacy** and **Avaya Infinity** to watch the business case update from $150k TCO to $15k TCO, proving a 90% maintenance cost reduction.
3. Go back to the Chat and click **Dynamic Churn Save**. Observe the Tandem Care checkpoint.
4. Click **Authorize Credit**. Observe the green **Avaya Business Outcome** banner that renders at the bottom of the final AI response, highlighting **$8,400 ARR Retained** and a **6.6x ROI** relative to customer acquisition cost.

---

## 🛠️ Tech Stack & Development

* **Core:** Standard HTML5 / CSS3 / Vanilla JavaScript.
* **Visualization:** Chart.js (CDNs imported dynamically for analytical dashboards).
* **Network Topology:** HTML5 Canvas rendering for real-time particle path simulations.
* **Zero Dependencies:** Fully self-contained client-side application. Compatible with direct browser execution via the `file://` protocol.
