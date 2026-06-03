# Avaya Infinity MCP Console – Solutions Consultant Technical Demo

This repository houses a high-fidelity frontend prototype demonstrating **Avaya Infinity's Model Context Protocol (MCP)** implementation, integrated with **Databricks Unity Catalog** for secure, audited communications routing and compliance.

I designed and built this application to serve as a live portfolio demonstration for my **Solutions Consultant / Sales Engineering interview**. It is structured specifically to prove how a Solutions Consultant can translate abstract backend software architecture (MCP gateway integrations, unified database buses) into high-impact, quantifiable business metrics ($ TCO savings, SLA protections, and revenue retention) that C-suite executives and sales leadership (like Carlos) care about.

---

## 💡 Why I Built This Application (The Intent)

1. **Bridging the Gap:** Technical decision-makers understand API standard protocols, but business leaders need to see cost and operational impacts. This console binds both together visually.
2. **Client Presentation Readiness:** The application is fully client-side and self-contained. It can run 100% offline (handling mock database queries and AI parses) for presentations in areas with spotty network coverage, or swap to **Live Gemini API mode** to demonstrate real tool-calling logic.
3. **Avaya Infinity Alignment:** Proves my deep understanding of Avaya's product roadmap, including AI-agnostic model routing (BYOAI), zero-copy Lakehouses, visual journey flowcharts (Edify), and supervisor checks (Tandem Care).

---

## 🖥️ What the Application Shows & Why It's Built

The UI is divided into four main tabs, each designed to demonstrate a different technical and business capability during a sales demo:

### 1. Live Protocol Trace Tab
* **What it shows:** A scrolling timeline showing step-by-step JSON payloads, headers, schemas, and returned tool data.
* **Why it's there:** To demystify LLM reasoning. Instead of treating generative AI as a "black box," it proves how the model makes precise tool calls (e.g. `salesforce_crm/get_customer_interaction_history`) via the MCP protocol.

### 2. Unified Lakehouse & Silos Tab
* **What it shows:** Live data grids for simulated PostgreSQL call logs, Salesforce CRM accounts, and SharePoint Knowledge Base folders. It also includes an active **ACM Media Telemetry SIP status table** and a rolling **ChartJS Jitter & Packet Loss graph**.
* **Why it's there:** Proves **Zero-Copy Data Access**. AI queries multiple disparate silos on-the-fly via read-only schemas without copying data. The ACM telemetry proves that legacy voice cores and modern gen-AI systems coexist in a unified dashboard.

### 3. Architecture Playground Tab
* **What it shows:** An interactive canvas animating particle paths. It contrasts legacy point-to-point connections ($N \times M$ spaghetti custom adapters) against the clean **Avaya Infinity N+M MCP standard bus**. It also houses a sub-tab showing the **Edify Journey Orchestrator node flow**.
* **Why it's there:** To visualize the reduction in structural IT complexity. It includes an **ROI & TCO Calculator** comparing the legacy model (~$150k/yr, 4 months setup, High Risk) against the MCP standard ($15k/yr, 2 hours setup, Protected).

### 4. Databricks Governance Log Tab
* **What it shows:** Real-time log entries showing audit trails of database updates, schema reads, and PII masking. It features a **🛡️ Governance Compliance Audit dashboard** tracking masked PII names, blocked queries, and SLA health.
* **Why it's there:** Highlights zero-trust security. It proves that HIPAA and security constraints are enforced at the gateway layer, protecting data even if the LLM client behaves unpredictably.

---

## 📂 Sales Pitch & Presentation Assets (Workspace Takeaways)

To support sales meetings and interview panels, I have compiled professional documentation directly in the workspace:

1. **[Avaya_Infinity_MCP_Pitch_Deck.pptx](file:///c:/Users/sbfal/OneDrive/Desktop/work/Avaya_Infinity_MCP_Pitch_Deck.pptx)**: A premium 8-slide PowerPoint presentation covering the project origin, what the app shows, alignment with Avaya's roadmap, deep-dives into Lakehouses & Security, and business outcomes.
2. **[Avaya_Infinity_MCP_Executive_Brief.pdf](file:///c:/Users/sbfal/OneDrive/Desktop/work/Avaya_Infinity_MCP_Executive_Brief.pdf)**: A print-readySolutions Brief PDF outlining executive summaries, cost comparison tables, and scenario ROI calculations.
3. **[make_pitch_assets.py](file:///c:/Users/sbfal/OneDrive/Desktop/work/make_pitch_assets.py)**: The underlying Python compilation script that dynamically generates the presentation slides and PDF brief.

---

## 🚀 The Interview Presentation Script (Step-by-Step)

Follow this exact flow to deliver a high-impact, 10-minute presentation to your interview panel:

### Phase 1: Establish the Vision (Why MCP & Unity Catalog?)
1. Open theSettings Modal (gear icon in header) and toggle **`PII Data Masking (HIPAA)`** to **ON**, then click **Save Configurations**.
2. Navigate to **Unified Lakehouse & Silos** tab. Explain:
   > *"Notice that all customer names are automatically redacted to a masked format. Our proxy layer ensures compliance prior to sending queries to the model client, mitigating HIPAA exposure risk in the cloud."*

### Phase 2: Demonstrate AI Reasoning & Trace
1. In the chat box, click the preset **"VIP CRM Escalation"** or type:
   > *"Jeff Edwards is complaining about voice jitter, check his ticket and search policies for troubleshooting rules."*
2. Instantly switch to the **Live Protocol Trace** tab. Explain:
   > *"Here we see Avaya's MCP in action. The AI client determines it needs customer details, and queries our Salesforce CRM server. In Step 3, it queries the SharePoint KB server. Notice that the names in the inputs and outputs are masked—securing data in-transit."*
3. Show the final chat response: The AI has combined Jeff's CRM case and the SharePoint policy text to output a resolution.

### Phase 3: Prove the Business TCO & ROI
1. Switch to the **Architecture Playground** tab. Show the particle flows. Explain:
   > *"In legacy platforms (N x M), connecting AI applications to databases requires custom point-to-point wrappers. Avaya Infinity simplifies this to an N+M bus. If we toggle the legacy layout at the bottom, TCO jumps to $150,000/yr with 4-month deployments. Toggling to Avaya Infinity lowers TCO by 90% to $15,000/yr, with deployment agility cut to 2 hours."*
2. Run the **Dynamic Churn Save** preset in Chat.
3. Under the Tandem Care checkpoint, click **Authorize Credit**. Point to the green **Avaya Business Outcome** banner:
   > *"By automating SOP policies, we authorized a $1,260 coupon discount to save an $8,400 churn contract. We achieved 6.6x ROI on customer acquisition cost, which I've logged directly to our Databricks audit tab."*
4. Open the **Databricks Governance Log** tab to show the audit logs and the incremented **PII Masked** and **Blocked Requests** counters on the compliance summary dashboard.
