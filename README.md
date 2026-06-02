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

### 3. Real-Time Solution Tools
* **Tandem Care (Human-in-the-Loop):** An automated workflow checkpoint that requests supervisor authorization before making high-stakes updates to CRM priorities.
* **Edify Journey Orchestrator:** An interactive, animated flowchart visualization of active voice, chat, and AI-triage routing packets.
* **Unified Lakehouse Viewer:** Instantly inspect mock PostgreSQL call logs, Zendesk CRM profiles, and SharePoint Knowledge Base SOP documents.

---

## 🚀 Step-by-Step Demo Guide (For Presenting)

Use this exact scenario script to demonstrate the prototype's reasoning and compliance features to recruiters or hiring managers:

### The "Voice Jitter" Diagnostic Flow
1. Open the settings (gear icon) and toggle **`PII Data Masking (HIPAA)`** to **ON**, then click **Save Configurations**.
2. In the chat console, type this complex request:
   > *"Jeff Edwards is complaining about voice jitter, check his ticket and search policies for troubleshooting rules."*
3. Swap to the **Live Protocol Trace** tab. Witness the AI orchestrate a multi-server response:
   - **Step 2:** Calls `salesforce_crm/get_customer_interaction_history` to pull CRM support records. Note that the input payload and output are masked to `J*** E***`.
   - **Step 3:** Calls `sharepoint_kb/sharepoint_kb_search` to query the SharePoint document repository for `"jitter"`.
4. Observe the chat response: The AI has compiled Jeff's active CRM case details with SharePoint’s `SOP-Support-101` policy text to output a masked resolution: *"According to SOP-Support-101, if packet loss exceeds 1.0%, reroute VoIP streams to fallback media gateways immediately."*
5. Check the **Databricks Governance Log** tab to verify that the compliance audit trails were logged and archived securely.

---

## 🛠️ Tech Stack & Development

* **Core:** Standard HTML5 / CSS3 / Vanilla JavaScript.
* **Visualization:** Chart.js (CDNs imported dynamically for analytical dashboards).
* **Network Topology:** HTML5 Canvas rendering for real-time particle path simulations.
* **Zero Dependencies:** Fully self-contained client-side application. Compatible with direct browser execution via the `file://` protocol.

---

*This prototype was designed and implemented by [Your Name] as a technical demonstration of Avaya Infinity's Model Context Protocol (MCP) and Edify Orchestration capabilities.*
