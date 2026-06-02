window.onerror = function(message, source, lineno, colno, error) {
  alert("Global Javascript Error:\n" + message + "\n\nLine: " + lineno + "\nSource: " + source);
  return false;
};

// ----------------------------------------------------
// Global State & Settings Storage
// ----------------------------------------------------
const state = {
  activeModel: 'gemini-1-5',
  apiMode: 'simulated', // 'simulated' or 'live-gemini'
  geminiApiKey: '',
  activeServers: {
    postgresql_db: true,
    salesforce_crm: true,
    sharepoint_kb: true
  },
  govPolicies: {
    hipaaMasking: false,
    restrictCallDb: false
  },
  archMode: 'mcp', // 'mcp' or 'legacy'
  isGenerating: false,
  messages: [],
  logs: []
};

// ----------------------------------------------------
// Local Databases (Simulated SQL/CRM/KB)
// ----------------------------------------------------
const localDatabases = {
  postgresql_db: [
    { time: '13:00', name: 'John Miller', wait: 12, channel: 'voice' },
    { time: '13:15', name: 'David Smith', wait: 14, channel: 'chat' },
    { time: '13:30', name: 'Alice Johnson', wait: 18, channel: 'chat' },
    { time: '13:45', name: 'Robert Lee', wait: 30, channel: 'email' },
    { time: '14:00', name: 'Marcus Sterling', wait: 148, channel: 'voice' },
    { time: '14:15', name: 'Dr. Evelyn Carter', wait: 162, channel: 'voice' },
    { time: '14:30', name: 'Linda Martinez', wait: 155, channel: 'chat' },
    { time: '14:45', name: 'James Wilson', wait: 34, channel: 'chat' },
    { time: '15:00', name: 'Sarah Conner', wait: 18, channel: 'email' },
    { time: '14:15', name: 'Jeff Edwards', wait: 345, channel: 'voice' }
  ],
  salesforce_crm: [
    { 
      name: 'Marcus Sterling', 
      account: 'Acme Corp', 
      tier: 'VIP', 
      email: 'm.sterling@acme.com', 
      ticket: 'Ticket #9421 - Billing Discrepancy',
      interactions: [
        { date: '2026-05-24', channel: 'voice', agent: 'Agent Robert', notes: 'Billing discrepancy reported on late shipment. Offered $15 courtesy credit. Customer unsatisfied.' },
        { date: '2026-05-28', channel: 'chat', agent: 'Aura AI', notes: 'Automated lookup for VoIP SIP voice quality troubleshooting.' }
      ]
    },
    { 
      name: 'Dr. Evelyn Carter', 
      account: 'Apex Healthcare', 
      tier: 'VIP', 
      email: 'e.carter@apexhealth.org', 
      ticket: 'Ticket #9842 - Dropped Call Jitter',
      interactions: [
        { date: '2026-05-18', channel: 'voice', agent: 'Agent John', notes: 'Reported voice quality jitter during peak hour. Traced trunk connection.' },
        { date: '2026-05-20', channel: 'email', agent: 'Aura AI', notes: 'Diverted queue load to digital self-service agents.' }
      ]
    },
    { 
      name: 'Alice Johnson', 
      account: 'Global Logistics', 
      tier: 'Standard', 
      email: 'a.johnson@globallog.com', 
      ticket: 'None',
      interactions: [
        { date: '2026-05-10', channel: 'chat', agent: 'Agent Sarah', notes: 'General inquiry on Webchat SLA thresholds. Resolved.' }
      ]
    },
    { 
      name: 'John Miller', 
      account: 'Initech', 
      tier: 'Standard', 
      email: 'j.miller@initech.com', 
      ticket: 'None',
      interactions: []
    },
    { 
      name: 'Sarah Conner', 
      account: 'Umbrella Corp', 
      tier: 'VIP', 
      email: 's.conner@umbrella.org', 
      ticket: 'Ticket #8842 - Voice Connection Reset',
      interactions: [
        { date: '2026-05-15', channel: 'voice', agent: 'Agent John', notes: 'Reported random voice disconnects. Advised upgrading softphone version.' }
      ]
    },
    { 
      name: 'Jeff Edwards', 
      account: 'Apex Healthcare', 
      tier: 'VIP', 
      email: 'j.edwards@apexhealth.org', 
      ticket: 'Ticket #9842 - Dropped Call Jitter',
      interactions: [
        { date: '2026-05-28', channel: 'voice', agent: 'Agent Robert', notes: 'Reported voice quality issues during peak hours. Opened ticket #9842.' }
      ]
    }
  ],
  sharepoint_kb: [
    {
      title: 'SOP-Finance-204_Refund_Policy_v4.pdf',
      text: 'Refunds for contractual disputes are eligible only if: (a) SLA was missed by >24 hrs, or (b) Billing discrepancy represents >5% of monthly recurring cost. All requests must be processed within 14 calendar days of case filing.'
    },
    {
      title: 'SLA-Gold-Tier-Support-Agreements.pdf',
      text: 'Gold tier enterprise customer contracts guarantee voice response times under 20 seconds. If average wait time exceeds 120 seconds in a given queue hour, ticket must be auto-escalated to Level-3 Engineering Specialists.'
    },
    {
      title: 'SOP-Support-101_Voice_Quality_Jitter_Troubleshooting.pdf',
      text: 'For customer voice quality degradation or network packet jitter issues, check SIP trunk logs. If SIP packet loss exceeds 1.0% or round-trip ping time is > 150ms, reroute VoIP audio streams via alternative media gateways and notify Level-2 engineers.'
    },
    {
      title: 'SOP-Billing-302_Late_Delivery_Credit_Matrix.pdf',
      text: 'Enterprise Gold and VIP tier accounts are eligible for customer service delay credits. If an active support queue wait time exceeds 4 hours, credit is $50. If delay exceeds 12 hours, a $100 recurring service discount must be applied to the account billing cycle.'
    },
    {
      title: 'SOP-Security-405_PII_Compliance_Audit_Rules.pdf',
      text: 'Under HIPAA and GDPR Zero-Trust standards, all agent messaging consoles must filter sensitive text. Model context protocol payloads must mask first and last names of customers using character masking algorithms before executing external LLM completion streams.'
    },
    {
      title: 'SOP-Operations-501_Agent_Load_Balancing.pdf',
      text: 'If concurrent incoming voice queues exceed 15 calls per agent pod, the Edify policy engine must dynamically redirect overflow streams to webchat digital queues and dispatch automated Aura AI agents to handle self-service resolutions.'
    },
    {
      title: 'SOP-Contracts-201_Cancellation_Grace_Period.pdf',
      text: 'Customers are authorized to cancel a newly signed service agreement within a 3-day grace period with zero termination penalties. Cancel requests received after 3 calendar days are subject to standard termination charges unless carrier service availability dropped below 99.5%.'
    },
    {
      title: 'SOP-Support-102_Hardware_Warranty_Replacement.pdf',
      text: 'Hardware components are covered under a 3-year limited warranty. For VIP clients, next-business-day on-site replacement is guaranteed. For Standard clients, return-to-factory repair applies with a 10-business-day turnaround time. All warranty claims require a diagnostic log attachment.'
    },
    {
      title: 'SOP-Billing-305_Tax_Exemption_Certificates.pdf',
      text: 'Tax exemption certificates must be verified and updated annually. For corporate clients claiming tax exemption, a valid state tax resale certificate or federal tax-exempt letter must be uploaded to the billing console. Refunds for tax charged prior to certificate verification are limited to the current billing cycle.'
    },
    {
      title: 'SOP-Security-408_Multi_Factor_Authentication_Bypass.pdf',
      text: 'MFA bypass is strictly prohibited except under emergency scenarios authorized by the Chief Security Officer. Standard support agents can issue a temporary 4-hour bypass code only after multi-factor identity verification (voice code + supervisor callback approval). All bypass actions are logged in the governance audit trail.'
    },
    {
      title: 'SOP-Contracts-205_Upgrade_Downgrade_SLA.pdf',
      text: 'Service contract upgrades take effect immediately upon digital signature, with pro-rated billing applied. Downgrades require a 30-day written notice and are only processed at the end of the current billing cycle. Downgrades on multi-year agreements are subject to early termination fees equal to 50% of the remaining contract value.'
    },
    {
      title: 'SOP-Operations-504_Outage_Communication_Protocol.pdf',
      text: 'In the event of a Tier-1 system outage (defined as service degradation affecting >10% of active trunks), the operations team must update the public status page within 15 minutes. Aura AI agents must be automatically configured to play a system-wide banner message and offer digital call-back options for incoming voice queues.'
    }
  ]
};

// ----------------------------------------------------
// UI Element Selections
// ----------------------------------------------------
const chatHistory = document.getElementById('chat-history-list');
const chatInputField = document.getElementById('chat-input-field');
const chatSendBtn = document.getElementById('chat-send-btn');
const modelSelector = document.getElementById('model-selector');

// Tab Toggles
const tabBtnTrace = document.getElementById('tab-btn-trace');
const tabBtnSilos = document.getElementById('tab-btn-silos');
const tabBtnArch = document.getElementById('tab-btn-arch');
const tabBtnAudit = document.getElementById('tab-btn-audit');
const tabPanelTrace = document.getElementById('tab-panel-trace');
const tabPanelSilos = document.getElementById('tab-panel-silos');
const tabPanelArch = document.getElementById('tab-panel-arch');
const tabPanelAudit = document.getElementById('tab-panel-audit');

// Settings Modal elements
const settingsGearBtn = document.getElementById('settings-gear-btn');
const settingsModal = document.getElementById('settings-modal');
const modalCloseX = document.getElementById('modal-close-x');
const settingsCancelBtn = document.getElementById('settings-cancel-btn');
const settingsSaveBtn = document.getElementById('settings-save-btn');
const apiModeSelect = document.getElementById('api-mode-select');
const geminiKeyGroup = document.getElementById('gemini-key-group');
const geminiApiKeyInput = document.getElementById('gemini-api-key');
const govToggleHipaa = document.getElementById('gov-toggle-hipaa');
const govToggleRestrict = document.getElementById('gov-toggle-restrict');

// View content containers
const traceStepsContainer = document.getElementById('dynamic-trace-steps-container');
const tracePlaceholder = document.getElementById('trace-placeholder');
const systemStatusDot = document.getElementById('system-status-dot');
const systemStatusText = document.getElementById('system-status-text');
const auditLogBox = document.getElementById('audit-log-box');
const clearAuditLogsBtn = document.getElementById('clear-audit-logs');
const toggleArchLegacy = document.getElementById('toggle-arch-legacy');
const toggleArchMcp = document.getElementById('toggle-arch-mcp');
const archConnectionsCount = document.getElementById('arch-connections-count');

// Edify Sub-tabs & Flowchart
const subTabNetworkBtn = document.getElementById('sub-tab-network');
const subTabEdifyBtn = document.getElementById('sub-tab-edify');
const archNetworkControls = document.getElementById('arch-network-controls');
const canvasWrapper = document.getElementById('canvas-wrapper');
const edifyFlowchartWrapper = document.getElementById('edify-flowchart-wrapper');
const edifyNodeDetailsCard = document.getElementById('edify-node-details-card');

// Silos Editor elements
const dbTbody = document.getElementById('silo-db-tbody');
const crmTbody = document.getElementById('silo-crm-tbody');
const dbRowCount = document.getElementById('db-row-count');
const crmRowCount = document.getElementById('crm-row-count');

// Input fields for adding data
const dbInputTime = document.getElementById('db-input-time');
const dbInputName = document.getElementById('db-input-name');
const dbInputWait = document.getElementById('db-input-wait');
const dbInputChannel = document.getElementById('db-input-channel');
const dbBtnAddDb = document.getElementById('silo-btn-add-db');

const crmInputName = document.getElementById('crm-input-name');
const crmInputOrg = document.getElementById('crm-input-org');
const crmInputTier = document.getElementById('crm-input-tier');
const crmInputEmail = document.getElementById('crm-input-email');
const crmInputTicket = document.getElementById('crm-input-ticket');
const crmBtnAddCrm = document.getElementById('silo-btn-add-crm');
const sessionSelector = document.getElementById('session-selector');

// Customer Interaction Selections
const interactionInputCustomer = document.getElementById('interaction-input-customer');
const interactionInputChannel = document.getElementById('interaction-input-channel');
const interactionInputAgent = document.getElementById('interaction-input-agent');
const interactionInputDate = document.getElementById('interaction-input-date');
const interactionInputNotes = document.getElementById('interaction-input-notes');
const interactionBtnAdd = document.getElementById('silo-btn-add-interaction');

// SharePoint KB Selections
const kbTbody = document.getElementById('silo-kb-tbody');
const kbDocViewerTitle = document.getElementById('kb-doc-viewer-title');
const kbDocViewerContent = document.getElementById('kb-doc-viewer-content');

// Server switches
const serverSwitches = {
  postgresql_db: document.getElementById('server-switch-pg'),
  salesforce_crm: document.getElementById('server-switch-crm'),
  sharepoint_kb: document.getElementById('server-switch-kb')
};

// ----------------------------------------------------
// Helper Functions
// ----------------------------------------------------

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Security: Mask text if HIPAA policy active
function maskText(name) {
  if (!state.govPolicies.hipaaMasking) return name;
  if (!name) return name;
  const parts = name.split(' ');
  return parts.map(part => {
    if (part.length <= 1) return part;
    return part[0] + '***';
  }).join(' ');
}

// Security: Mask sensitive attributes in JSON payloads if HIPAA policy active
function maskPayload(payload) {
  if (!state.govPolicies.hipaaMasking) return payload;
  if (!payload) return payload;
  
  const masked = JSON.parse(JSON.stringify(payload));
  
  if (masked.customer_name) {
    masked.customer_name = maskText(masked.customer_name);
  }
  
  const crmNames = localDatabases.salesforce_crm.map(c => c.name);
  const dbNames = localDatabases.postgresql_db.map(d => d.name);
  const allNames = [...new Set([...crmNames, ...dbNames])];
  
  function recursiveMask(obj) {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        allNames.forEach(name => {
          if (obj[key].includes(name)) {
            obj[key] = obj[key].replace(name, maskText(name));
          }
        });
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        recursiveMask(obj[key]);
      }
    }
  }
  recursiveMask(masked);
  return masked;
}

// Helper to write to Databricks Audit Log
function addAuditLog(type, component, text) {
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  
  const logDiv = document.createElement('div');
  logDiv.className = 'log-entry';
  logDiv.innerHTML = `
    <span class="log-timestamp">${timeStr}</span>
    <span class="log-badge ${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'}">${component}</span>
    <span class="log-text">${text}</span>
  `;
  auditLogBox.appendChild(logDiv);
  auditLogBox.scrollTop = auditLogBox.scrollHeight;
}

// ----------------------------------------------------
// Settings & Config Modal Management
// ----------------------------------------------------

// Load settings from LocalStorage (safely wrapped in try-catch to support file:// protocol)
function loadStoredSettings() {
  try {
    const savedMode = localStorage.getItem('avaya_mcp_api_mode');
    const savedKey = localStorage.getItem('avaya_mcp_gemini_key');
    const savedHipaa = localStorage.getItem('avaya_mcp_hipaa');
    const savedRestrict = localStorage.getItem('avaya_mcp_restrict');
    
    if (savedMode) state.apiMode = savedMode;
    if (savedKey) state.geminiApiKey = savedKey;
    if (savedHipaa) state.govPolicies.hipaaMasking = savedHipaa === 'true';
    if (savedRestrict) state.govPolicies.restrictCallDb = savedRestrict === 'true';
  } catch (e) {
    console.warn("localStorage is not accessible in this context. Defaulting to in-memory configuration.", e);
  }
  
  // Set UI elements
  apiModeSelect.value = state.apiMode;
  geminiApiKeyInput.value = state.geminiApiKey;
  govToggleHipaa.checked = state.govPolicies.hipaaMasking;
  govToggleRestrict.checked = state.govPolicies.restrictCallDb;
  
  if (state.apiMode === 'live-gemini') {
    geminiKeyGroup.style.display = 'block';
  } else {
    geminiKeyGroup.style.display = 'none';
  }
}

// Save Settings
function saveSettings() {
  state.apiMode = apiModeSelect.value;
  state.geminiApiKey = geminiApiKeyInput.value.trim();
  state.govPolicies.hipaaMasking = govToggleHipaa.checked;
  state.govPolicies.restrictCallDb = govToggleRestrict.checked;
  
  try {
    localStorage.setItem('avaya_mcp_api_mode', state.apiMode);
    localStorage.setItem('avaya_mcp_gemini_key', state.geminiApiKey);
    localStorage.setItem('avaya_mcp_hipaa', state.govPolicies.hipaaMasking);
    localStorage.setItem('avaya_mcp_restrict', state.govPolicies.restrictCallDb);
  } catch (e) {
    console.warn("Unable to save configurations to localStorage in this context.", e);
  }
  
  addAuditLog('success', 'Config', `Saved settings. Mode: ${state.apiMode}. Masking: ${state.govPolicies.hipaaMasking}. SQL Restrict: ${state.govPolicies.restrictCallDb}`);
  settingsModal.classList.remove('active');
}

const activeCharts = {};

// Safe ChartJS wrapper to handle offline/no-internet environments gracefully
function createChart(ctx, config) {
  if (typeof Chart === 'undefined') {
    console.warn("Chart.js is not loaded. Fallback text rendering used.");
    const container = ctx.parentElement;
    if (container) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 25px 10px; font-size: 0.8rem; border: 1px dashed var(--border-color); border-radius: 6px; background: rgba(0,0,0,0.1);">[Chart: Chart.js library is offline. Data was successfully loaded, but visualization requires internet access to fetch Chart.js CDN.]</div>`;
    }
    return null;
  }
  
  const canvasId = ctx.id || ctx.getAttribute('id');
  if (canvasId && activeCharts[canvasId]) {
    try {
      activeCharts[canvasId].destroy();
    } catch (e) {
      console.warn("Error destroying chart instance:", e);
    }
  }
  
  const chartInstance = new Chart(ctx, config);
  if (canvasId) {
    activeCharts[canvasId] = chartInstance;
  }
  return chartInstance;
}

settingsGearBtn.addEventListener('click', () => {
  loadStoredSettings();
  settingsModal.classList.add('active');
});

modalCloseX.addEventListener('click', () => settingsModal.classList.remove('active'));
settingsCancelBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
settingsSaveBtn.addEventListener('click', saveSettings);

apiModeSelect.addEventListener('change', (e) => {
  if (e.target.value === 'live-gemini') {
    geminiKeyGroup.style.display = 'block';
  } else {
    geminiKeyGroup.style.display = 'none';
  }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove('active');
  }
});

// ----------------------------------------------------
// Tab Switching Management
// ----------------------------------------------------
const tabBtns = [tabBtnTrace, tabBtnSilos, tabBtnArch, tabBtnAudit];
const tabPanels = [tabPanelTrace, tabPanelSilos, tabPanelArch, tabPanelAudit];

const tabExplainers = {
  trace: {
    badge: 'Protocol Insight',
    title: 'Live Protocol Trace',
    desc: 'Step-by-step inspection of standard JSON payloads exchanged between the AI brain and enterprise database servers.',
    value: 'Standardizes AI connections (Model Context Protocol), replacing legacy custom code integrations ($N × M$) with a single open standard ($N+M$).',
    color: 'var(--color-cyan)',
    bg: 'rgba(0, 240, 255, 0.1)'
  },
  silos: {
    badge: 'Zero-Copy Architecture',
    title: 'Unified Lakehouse & Silos',
    desc: 'Live analytical tables illustrating mock PostgreSQL customer database, Salesforce CRM records, and SharePoint KB repositories.',
    value: 'Eliminates data migration overhead. AI queries across siloed legacy data sources securely, using read-only API schemas on-the-fly.',
    color: 'var(--color-yellow)',
    bg: 'rgba(245, 158, 11, 0.1)'
  },
  arch: {
    badge: 'Complexity Reduction',
    title: 'Architecture Playground',
    desc: 'Interactive network particle flow representing spaghetti integrations versus modern open standard connection orchestration.',
    value: 'Visualizes structural changes. Reduces active enterprise integration connection overhead by up to 70%, slashing maintenance costs.',
    color: 'var(--color-purple)',
    bg: 'rgba(139, 92, 246, 0.1)'
  },
  audit: {
    badge: 'Zero-Trust Audit',
    title: 'Databricks Governance Log',
    desc: 'Real-time security logs showing role-based queries, API routing restrictions, and automatic PII redaction actions.',
    value: 'HIPAA/GDPR Compliance. Ensures that every AI model request is logged, audited, and strictly permission-checked by Databricks Unity Catalog.',
    color: 'var(--color-green)',
    bg: 'rgba(16, 185, 129, 0.1)'
  }
};

function updateTabExplainer(target) {
  try {
    const banner = document.getElementById('tab-explainer-banner');
    const badge = document.getElementById('explainer-badge');
    const title = document.getElementById('explainer-title');
    const desc = document.getElementById('explainer-desc');
    const valText = document.getElementById('explainer-value-text');
    
    if (!banner || !badge || !title || !desc || !valText) {
      console.warn("Dynamic banner: One or more DOM elements were null.", { banner, badge, title, desc, valText });
      return;
    }
    
    const info = tabExplainers[target];
    if (!info) {
      console.warn("Dynamic banner: No explainer configuration for target", target);
      return;
    }
    
    console.log("Updating tab explainer banner for target:", target, info);
    
    badge.innerText = info.badge;
    title.innerText = info.title;
    desc.innerText = info.desc;
    valText.innerText = info.value;
    
    badge.style.color = info.color;
    badge.style.background = info.bg;
    banner.style.borderLeftColor = info.color;
    
    // Subtle animation
    banner.style.transform = 'scale(0.99)';
    banner.style.opacity = '0.85';
    setTimeout(() => {
      banner.style.transform = 'scale(1)';
      banner.style.opacity = '1';
    }, 100);
  } catch (err) {
    console.error("Error updating tab explainer banner:", err);
  }
}

function switchTab(target) {
  tabBtns.forEach(btn => btn.classList.remove('active'));
  tabPanels.forEach(panel => panel.classList.remove('active'));
  
  if (target === 'trace') {
    tabBtnTrace.classList.add('active');
    tabPanelTrace.classList.add('active');
  } else if (target === 'silos') {
    tabBtnSilos.classList.add('active');
    tabPanelSilos.classList.add('active');
    renderDataSiloTables();
  } else if (target === 'arch') {
    tabBtnArch.classList.add('active');
    tabPanelArch.classList.add('active');
    initArchCanvas();
  } else if (target === 'audit') {
    tabBtnAudit.classList.add('active');
    tabPanelAudit.classList.add('active');
  }
  
  updateTabExplainer(target);
}

tabBtnTrace.addEventListener('click', () => switchTab('trace'));
tabBtnSilos.addEventListener('click', () => switchTab('silos'));
tabBtnArch.addEventListener('click', () => switchTab('arch'));
tabBtnAudit.addEventListener('click', () => switchTab('audit'));

clearAuditLogsBtn.addEventListener('click', () => {
  auditLogBox.innerHTML = '';
  addAuditLog('info', 'Audit', 'Governance audit log cleared by administrator.');
});

// ----------------------------------------------------
// Active Server Switches
// ----------------------------------------------------
Object.keys(serverSwitches).forEach(key => {
  serverSwitches[key].addEventListener('click', () => {
    state.activeServers[key] = !state.activeServers[key];
    if (state.activeServers[key]) {
      serverSwitches[key].classList.add('active');
      addAuditLog('success', 'MCP', `Established connection to MCP target server: ${key}`);
    } else {
      serverSwitches[key].classList.remove('active');
      addAuditLog('warning', 'MCP', `Revoked connection. Removed tool registries from target: ${key}`);
    }
    updateSystemState();
  });
});

modelSelector.addEventListener('change', (e) => {
  state.activeModel = e.target.value;
  addAuditLog('info', 'Client', `Active Brain swapped to: ${e.target.options[e.target.selectedIndex].text}`);
});

function updateSystemState() {
  const activeCount = Object.values(state.activeServers).filter(Boolean).length;
  if (activeCount === 3) {
    systemStatusDot.className = 'status-dot';
    systemStatusText.innerText = 'MCP Gateway: Secure';
  } else if (activeCount > 0) {
    systemStatusDot.className = 'status-dot loading';
    systemStatusText.innerText = `MCP Gateway: ${activeCount}/3 Active`;
  } else {
    systemStatusDot.className = 'status-dot';
    systemStatusDot.style.backgroundColor = 'var(--color-avaya-red)';
    systemStatusDot.style.boxShadow = '0 0 10px var(--color-avaya-red-glow)';
    systemStatusText.innerText = 'MCP Gateway: Offline';
  }
}

// ----------------------------------------------------
// Data Silos Editor - Inspect & Insert Data
// ----------------------------------------------------
function renderDataSiloTables() {
  // Render PostgreSQL DB Table
  dbTbody.innerHTML = '';
  localDatabases.postgresql_db.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.time}</td>
      <td>${maskText(row.name)}</td>
      <td>${row.wait}</td>
      <td><span style="color: ${row.channel === 'voice' ? 'var(--color-avaya-red)' : row.channel === 'chat' ? 'var(--color-cyan)' : 'var(--color-purple)'}">${row.channel}</span></td>
    `;
    dbTbody.appendChild(tr);
  });
  dbRowCount.innerText = `${localDatabases.postgresql_db.length} records`;

  // Render CRM Table
  crmTbody.innerHTML = '';
  localDatabases.salesforce_crm.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${maskText(row.name)}</td>
      <td>${row.account}</td>
      <td><span class="step-tag" style="background: ${row.tier === 'VIP' ? 'var(--color-avaya-red-glow)' : 'rgba(255,255,255,0.05)'}; color: ${row.tier === 'VIP' ? 'white' : 'var(--text-secondary)'}">${row.tier}</span></td>
      <td><span style="font-size:0.75rem; color:var(--text-secondary);">${row.email || 'N/A'}</span></td>
      <td><span style="font-size:0.75rem; color:${row.ticket && row.ticket !== 'None' ? 'var(--color-yellow)' : 'var(--text-muted)'};">${row.ticket || 'None'}</span></td>
    `;
    crmTbody.appendChild(tr);
  });
  crmRowCount.innerText = `${localDatabases.salesforce_crm.length} accounts`;

  // Populate Customer Selection dropdown dynamically
  if (interactionInputCustomer) {
    const prevSelected = interactionInputCustomer.value;
    interactionInputCustomer.innerHTML = '';
    localDatabases.salesforce_crm.forEach(row => {
      const opt = document.createElement('option');
      opt.value = row.name;
      opt.innerText = maskText(row.name);
      interactionInputCustomer.appendChild(opt);
    });
    if (prevSelected && localDatabases.salesforce_crm.some(row => row.name === prevSelected)) {
      interactionInputCustomer.value = prevSelected;
    }
  }

  // Render SharePoint KB table
  if (kbTbody) {
    kbTbody.innerHTML = '';
    localDatabases.sharepoint_kb.forEach((doc, idx) => {
      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';
      tr.innerHTML = `
        <td style="color:var(--color-cyan); font-weight:600;">SOP-KB-${100 + idx}</td>
        <td>${doc.title}</td>
      `;
      tr.addEventListener('click', () => {
        if (kbDocViewerTitle) kbDocViewerTitle.innerText = doc.title;
        if (kbDocViewerContent) kbDocViewerContent.innerText = doc.text;
        addAuditLog('info', 'SharePoint', `Supervisor Sarah viewed SharePoint policy document: ${doc.title}`);
      });
      kbTbody.appendChild(tr);
    });
    const rowCountEl = document.getElementById('kb-row-count');
    if (rowCountEl) rowCountEl.innerText = `${localDatabases.sharepoint_kb.length} documents`;
  }
}

// Insert PostgreSQL Call Log Row
dbBtnAddDb.addEventListener('click', () => {
  const time = dbInputTime.value.trim() || '14:15';
  const name = dbInputName.value.trim();
  const wait = parseInt(dbInputWait.value) || 0;
  const channel = dbInputChannel.value;
  
  if (!name) {
    alert('Please enter a customer name.');
    return;
  }
  
  localDatabases.postgresql_db.push({ time, name, wait, channel });
  addAuditLog('success', 'Database', `PostgreSQL INSERT: Added call log row for ${maskText(name)}.`);
  renderDataSiloTables();
  
  // Reset input field
  dbInputName.value = '';
});

// Insert CRM Account Row
crmBtnAddCrm.addEventListener('click', () => {
  const name = crmInputName.value.trim();
  const org = crmInputOrg.value.trim();
  const tier = crmInputTier.value;
  const email = crmInputEmail.value.trim() || `${name.toLowerCase().replace(' ', '.')}@${org.toLowerCase().replace(' ', '')}.com`;
  const ticket = crmInputTicket.value.trim() || 'None';
  
  if (!name || !org) {
    alert('Please enter customer name and organization.');
    return;
  }
  
  const welcomeNotes = ticket !== 'None' 
    ? `Created support ticket for billing/service inquiry: ${ticket}. Handled via Aura AI digital triage.`
    : `Registered client account for ${name} under enterprise account ${org}.`;
  
  const interactions = [
    { 
      date: new Date().toISOString().split('T')[0], 
      channel: 'email', 
      agent: 'Aura AI', 
      notes: welcomeNotes
    }
  ];
  
  if (tier === 'VIP') {
    interactions.unshift({
      date: '2026-05-28',
      channel: 'voice',
      agent: 'Agent Sarah',
      notes: `VIP SLA introductory call. Discussed network stability, trunk utilization, and set up priority routing rules.`
    });
  } else {
    interactions.unshift({
      date: '2026-05-25',
      channel: 'chat',
      agent: 'Agent Robert',
      notes: `General billing cycle onboarding and registration setup.`
    });
  }
  
  localDatabases.salesforce_crm.push({ name, account: org, tier, email, ticket, interactions });
  addAuditLog('success', 'CRM', `CRM INSERT: Registered Account mapping for ${maskText(name)} (${org} - ${tier}) with profile details & past history.`);
  renderDataSiloTables();
  
  // Reset input fields
  crmInputName.value = '';
  crmInputOrg.value = '';
  crmInputEmail.value = '';
  crmInputTicket.value = '';
});

// Insert Customer Interaction
if (interactionBtnAdd) {
  interactionBtnAdd.addEventListener('click', () => {
    const customerName = interactionInputCustomer.value;
    const channel = interactionInputChannel.value;
    const agent = interactionInputAgent.value.trim() || 'Aura AI';
    const date = interactionInputDate.value.trim() || '2026-06-01';
    const notes = interactionInputNotes.value.trim();
    
    if (!customerName) {
      alert('Please select a customer.');
      return;
    }
    if (!notes) {
      alert('Please enter interaction notes.');
      return;
    }
    
    const customer = localDatabases.salesforce_crm.find(crm => crm.name === customerName);
    if (customer) {
      if (!customer.interactions) customer.interactions = [];
      customer.interactions.push({ date, channel, agent, notes });
      addAuditLog('success', 'CRM', `CRM UPDATE: Logged past interaction for customer ${maskText(customerName)} (Agent: ${agent}, Channel: ${channel}).`);
      renderDataSiloTables();
      
      // Reset notes field
      interactionInputNotes.value = '';
    } else {
      alert('Customer not found.');
    }
  });
}

// ----------------------------------------------------
// Local MCP Tool Execution Functions
// ----------------------------------------------------
const mcpTools = {
  // Query 1: query_call_metrics
  query_call_metrics: (args) => {
    // Audit check: Check if blocked
    if (state.govPolicies.restrictCallDb) {
      throw new Error("403 Permission Denied: Databricks Unity Catalog Policy enforces catalog lockout on database 'postgresql_db'.");
    }
    
    const start = args.start_time || '13:00';
    const end = args.end_time || '15:00';
    
    // Filter local postgres DB call logs
    const filteredLogs = localDatabases.postgresql_db.filter(log => {
      return log.time >= start && log.time <= end;
    });
    
    const times = filteredLogs.map(log => log.time);
    const waits = filteredLogs.map(log => log.wait);
    
    return {
      success: true,
      data: {
        times: times,
        wait_times: waits,
        logs: filteredLogs.map(log => ({
          time: log.time,
          name: maskText(log.name),
          wait: log.wait,
          channel: log.channel
        }))
      }
    };
  },
  
  // Query 2: search_vip_queues
  search_vip_queues: (args) => {
    const limit = args.max_wait_sec || 120;
    
    // Filter logs that exceed wait time
    const waitList = localDatabases.postgresql_db.filter(log => log.wait > limit);
    const vipList = [];
    
    waitList.forEach(log => {
      // Find account in CRM
      const match = localDatabases.salesforce_crm.find(crm => crm.name === log.name);
      if (match && match.tier === 'VIP') {
        vipList.push({
          name: maskText(log.name),
          account: match.account,
          wait_sec: log.wait,
          channel: log.channel,
          email: match.email || 'N/A',
          ticket: match.ticket || 'None'
        });
      }
    });
    
    return {
      success: true,
      active_vip_waiting: vipList
    };
  },

  // Query 3: get_live_channel_volume
  get_live_channel_volume: () => {
    // Count channel occurrences in PostgreSQL logs
    const channels = { voice: 0, chat: 0, email: 0 };
    localDatabases.postgresql_db.forEach(log => {
      if (channels[log.channel] !== undefined) {
        channels[log.channel]++;
      }
    });
    
    // Convert counts to a visual volume scaler
    const voiceCount = channels.voice * 10 + 12;
    const chatCount = channels.chat * 12 + 15;
    const emailCount = channels.email * 8 + 5;
    
    return {
      success: true,
      concurrent_streams: {
        voice: voiceCount,
        chat: chatCount,
        email: emailCount
      }
    };
  },

  // Query 4: sharepoint_kb_search
  sharepoint_kb_search: (args) => {
    const query = (args.query || '').toLowerCase();
    
    // Simple mock semantic query search
    const matches = localDatabases.sharepoint_kb.filter(doc => {
      return doc.title.toLowerCase().includes(query) || doc.text.toLowerCase().includes(query);
    });
    
    return {
      success: true,
      document_matches: matches.map(doc => ({
        title: doc.title,
        text: doc.text
      }))
    };
  },

  // Query 5: get_customer_interaction_history
  get_customer_interaction_history: (args) => {
    const customer = localDatabases.salesforce_crm.find(crm => crm.name === args.customer_name);
    if (!customer) throw new Error(`Customer '${args.customer_name}' not found in CRM.`);
    return {
      success: true,
      customer: maskText(customer.name),
      interactions: customer.interactions || []
    };
  }
};

// ----------------------------------------------------
// UI Logic for Handling Submissions (Chat Entrypoint)
// ----------------------------------------------------

function appendMessage(sender, text, avatarChar) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  
  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'msg-avatar';
  avatarDiv.innerText = avatarChar;
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'msg-bubble';
  
  // Format markdown inside text
  let htmlContent = formatMarkdownText(text);
  bubbleDiv.innerHTML = htmlContent;
  
  if (sender === 'user') {
    messageDiv.appendChild(bubbleDiv);
    messageDiv.appendChild(avatarDiv);
  } else {
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(bubbleDiv);
  }
  
  chatHistory.appendChild(messageDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function animateGuardrailsLoading() {
  const gVal = document.getElementById('guardrail-groundedness');
  const tVal = document.getElementById('guardrail-toxicity');
  const pVal = document.getElementById('guardrail-pii');
  const rVal = document.getElementById('guardrail-relevance');
  
  const gFill = document.getElementById('fill-groundedness');
  const tFill = document.getElementById('fill-toxicity');
  const pFill = document.getElementById('fill-pii');
  const rFill = document.getElementById('fill-relevance');
  
  if (!gVal || !tVal || !pVal || !rVal) return;
  
  gVal.innerText = 'Evaluating...';
  tVal.innerText = 'Scanning...';
  pVal.innerText = 'Auditing...';
  rVal.innerText = 'Measuring...';
  
  gFill.style.width = '20%';
  tFill.style.width = '15%';
  pFill.style.width = '30%';
  rFill.style.width = '25%';
}

function animateGuardrailsComplete() {
  const gVal = document.getElementById('guardrail-groundedness');
  const tVal = document.getElementById('guardrail-toxicity');
  const pVal = document.getElementById('guardrail-pii');
  const rVal = document.getElementById('guardrail-relevance');
  
  const gFill = document.getElementById('fill-groundedness');
  const tFill = document.getElementById('fill-toxicity');
  const pFill = document.getElementById('fill-pii');
  const rFill = document.getElementById('fill-relevance');
  
  if (!gVal || !tVal || !pVal || !rVal) return;
  
  const groundedness = (97.5 + Math.random() * 2).toFixed(1);
  const relevance = (96.5 + Math.random() * 3).toFixed(1);
  
  gVal.innerText = `${groundedness}%`;
  tVal.innerText = '100.0% Passed';
  pVal.innerText = '100.0% Audited';
  rVal.innerText = `${relevance}%`;
  
  gFill.style.width = `${groundedness}%`;
  tFill.style.width = '100%';
  pFill.style.width = '100%';
  rFill.style.width = `${relevance}%`;
}

async function handleSendMessage(presetKey = null) {
  if (state.isGenerating) return;
  
  let userText = '';
  let activePresetKey = null;
  
  if (presetKey) {
    activePresetKey = presetKey;
    if (presetKey === 'preset-wait-time') userText = 'A wait-time spike occurred around 2 PM today. Cross-reference call records with agent logs and CRM accounts to find the cause.';
    else if (presetKey === 'preset-vip-escalate') userText = 'Check for any VIP accounts in Zendesk with active calls, and raise their queue priority if wait times exceed 2 minutes.';
    else if (presetKey === 'preset-agent-util') userText = 'Create an interactive dashboard of active call volume by channel (Voice vs. Chat) and check active agent status.';
    else if (presetKey === 'preset-refund-policy') userText = 'A customer wants a refund on a disputed contract. Check our SharePoint Knowledge Base for the refund eligibility policy.';
    else if (presetKey === 'preset-churn-retention') userText = 'Jeff Edwards is threatening to cancel service due to high pricing, check his CRM account profile value and search policies for discount offering rules.';
  } else {
    userText = chatInputField.value.trim();
    if (!userText) return;
    
    // Map text keywords to scenarios
    const lText = userText.toLowerCase();
    if (lText.includes('wait') || lText.includes('spike')) activePresetKey = 'preset-wait-time';
    else if (lText.includes('vip') || lText.includes('escalate')) activePresetKey = 'preset-vip-escalate';
    else if (lText.includes('queue') || lText.includes('channel') || lText.includes('volume')) activePresetKey = 'preset-agent-util';
    else if (lText.includes('refund') || lText.includes('policy') || lText.includes('contract')) activePresetKey = 'preset-refund-policy';
    else if (lText.includes('cancel') || lText.includes('churn') || lText.includes('retention') || lText.includes('discount')) activePresetKey = 'preset-churn-retention';
    else if (lText.includes('how many') || lText.includes('incoming') || lText.includes('caller') || lText.includes('who')) activePresetKey = 'preset-incoming-calls';
  }

  chatInputField.value = '';
  
  // Auto-minimize Guide and Presets to maximize vertical space for results
  const guideWidgetEl = document.getElementById('demo-guide-widget');
  const guideToggleBtnEl = document.getElementById('guide-toggle-btn');
  if (guideWidgetEl && !guideWidgetEl.classList.contains('minimized')) {
    guideWidgetEl.classList.add('minimized');
    if (guideToggleBtnEl) guideToggleBtnEl.innerText = 'Expand';
  }

  const scenariosWidgetEl = document.getElementById('scenarios-widget');
  const scenariosToggleBtnEl = document.getElementById('scenarios-toggle-btn');
  if (scenariosWidgetEl && !scenariosWidgetEl.classList.contains('minimized')) {
    scenariosWidgetEl.classList.add('minimized');
    if (scenariosToggleBtnEl) scenariosToggleBtnEl.innerText = 'Expand';
  }

  state.isGenerating = true;

  // Trigger guardrails animation
  animateGuardrailsLoading();

  // Append user bubble
  appendMessage('user', userText, 'U');
  chatHistory.scrollTop = chatHistory.scrollHeight;

  // Swap to trace panel
  switchTab('trace');
  traceStepsContainer.innerHTML = '';
  tracePlaceholder.style.display = 'none';

  addAuditLog('info', 'Client', `Dispatching query to active model '${state.activeModel}' (Mode: ${state.apiMode})`);

  // Choose Execution Mode: Offline Simulated or Live Gemini API
  if (state.apiMode === 'live-gemini') {
    await runLiveGeminiToolLoop(userText);
  } else {
    await runSimulatedToolLoop(activePresetKey, userText);
  }
  
  // Complete guardrails evaluation
  animateGuardrailsComplete();
  
  state.isGenerating = false;
}

// ----------------------------------------------------
// MODE 1: Simulated Tool Loop (Offline Mode)
// ----------------------------------------------------
async function runSimulatedToolLoop(presetKey, userText) {
  // Preset scenarios configs
  const presetConfig = {
    'preset-wait-time': {
      requiredServers: ['postgresql_db', 'salesforce_crm'],
      steps: [
        {
          title: 'Query PostgreSQL Database (Call Log DB)',
          tag: 'postgresql_db/query_call_metrics',
          desc: 'Pull statistics on wait times, total queues, and abandonment rate between 13:00 and 15:00.',
          payload: { start_time: '13:00', end_time: '15:00' },
          execute: () => mcpTools.query_call_metrics({ start_time: '13:00', end_time: '15:00' })
        },
        {
          title: 'Query Salesforce CRM (Agent Scheduling & Status)',
          tag: 'salesforce_crm/query_agent_status',
          desc: 'Analyze active agent metrics, training schedules, and shift status at 14:00.',
          payload: { date: '2026-05-31', hour: '14:00' },
          execute: () => ({ success: true, agents_active: 18, agents_break: 12, agents_in_training: 15 })
        }
      ],
      generate: () => {
        // Compute metrics dynamically from current local PostgreSQL database array!
        const start = '13:00';
        const end = '15:00';
        const filtered = localDatabases.postgresql_db.filter(log => log.time >= start && log.time <= end);
        const maxWait = filtered.reduce((max, log) => log.wait > max ? log.wait : max, 0);
        
        return `
          <p>I completed the query using your **PostgreSQL Database** and **Zendesk CRM** servers via MCP. Here is what I discovered:</p>
          <p>A severe wait-time spike occurred starting at **14:00 (2:00 PM)**, peaking at **${maxWait} seconds**. At this hour, active agent count dropped from **42** down to **18**.</p>
          
          <div class="chart-container-wrapper">
            <canvas id="wait-time-chart" style="width: 100%; height: 180px;"></canvas>
          </div>
          
          <p>**Primary Cause Identified:**</p>
          <p style="padding-left: 10px; border-left: 2px solid var(--color-yellow); margin: 6px 0; color: var(--text-secondary); font-size: 0.85rem;">
            Zendesk CRM reports indicate a mandatory training webinar on "Avaya Infinity Updates" took place from 14:00 to 14:45. This automatically pulled 15 agents from active queues while 12 other agents were concurrently scheduled for breaks.
          </p>
          <p>**Resolution Actions Taken via CRM Tool Call:**</p>
          <ul>
            <li>Triggered schedule warning to block concurrent break schedules during training webinars.</li>
            <li>Diverted chat volumes to digital self-service lanes.</li>
          </ul>
        `;
      },
      render: () => {
        const ctx = document.getElementById('wait-time-chart');
        if (!ctx) return;
        
        // Dynamically plot values from PostgreSQL logs
        const logs = localDatabases.postgresql_db.filter(log => log.time >= '13:00' && log.time <= '15:00');
        const labels = logs.map(l => l.time);
        const data = logs.map(l => l.wait);
        
        createChart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Avg Wait (sec)',
              data: data,
              borderColor: '#DA291C',
              backgroundColor: 'rgba(218, 41, 28, 0.15)',
              borderWidth: 2,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af', font: { size: 9 } } },
              x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af', font: { size: 9 } } }
            },
            plugins: { legend: { display: false } }
          }
        });
      }
    },
    'preset-vip-escalate': {
      requiredServers: ['salesforce_crm'],
      steps: [
        {
          title: 'Query Zendesk CRM (VIP Queues)',
          tag: 'salesforce_crm/search_vip_queues',
          desc: 'Scan current live queues and cross-reference tier status for enterprise accounts.',
          payload: { max_wait_sec: 120 },
          execute: () => mcpTools.search_vip_queues({ max_wait_sec: 120 })
        }
      ],
      generate: () => {
        // Pull live matching VIP callers from database
        const res = mcpTools.search_vip_queues({ max_wait_sec: 120 });
        const vips = res.active_vip_waiting;
        
        if (vips.length === 0) {
          return `<p>I checked your Zendesk CRM queues. Currently, **no active VIP callers** exceed the 2-minute wait limit threshold.</p>`;
        }
        
        let cards = '';
        vips.forEach(vip => {
          cards += `
            <div class="dash-card">
              <h4>${vip.account} (${vip.name})</h4>
              <p class="alert">Wait: ${vip.wait_sec}s</p>
              <span style="font-size:0.7rem; color:var(--text-secondary)">Channel: ${vip.channel}</span>
              <div style="font-size:0.65rem; color:var(--text-muted); border-top:1px solid rgba(255,255,255,0.05); margin-top:6px; padding-top:4px; text-align:left;">
                Email: ${vip.email}<br>
                Active: ${vip.ticket}
              </div>
            </div>
          `;
        });
        
        const targetName = vips[0].name;
        
        return `
          <p>Scan completed. I detected **${vips.length} Enterprise VIP callers** waiting in queue beyond the 2-minute SLA threshold:</p>
          
          <div class="dashboard-grid">${cards}</div>
          
          <div class="tandem-card" id="tandem-auth-card">
            <div class="tandem-header">
              <span class="tandem-title">🤝 Tandem Care Checkpoint</span>
              <span class="tandem-badge">Awaiting Authorization</span>
            </div>
            <div class="tandem-body">
              Aura AI proposes running tool <code>salesforce_crm/escalate_priority</code> to reroute matching VIP accounts to L3 immediate engineering support.
            </div>
            <div class="tandem-footer">
              <button class="tandem-btn decline" onclick="handleTandemDecline('${targetName}')">Decline Action</button>
              <button class="tandem-btn approve" onclick="handleTandemApprove('${targetName}')">Authorize Escalation</button>
            </div>
          </div>
        `;
      },
      render: () => {}
    },
    'preset-agent-util': {
      requiredServers: ['postgresql_db', 'salesforce_crm'],
      steps: [
        {
          title: 'Query Live Channel Volume',
          tag: 'postgresql_db/get_live_channel_volume',
          desc: 'Scan current concurrent streams matching active VoIP sip lines and WebRTC sockets.',
          payload: {},
          execute: () => mcpTools.get_live_channel_volume()
        }
      ],
      generate: () => {
        return `
          <p>I have built a real-time communications dashboard using live metrics exposed by PostgreSQL and your CRM servers.</p>
          
          <div class="chart-container-wrapper" style="display: flex; gap: 10px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 150px; height: 180px;">
              <p style="font-size: 0.75rem; text-align: center; color: var(--text-secondary); margin-bottom: 4px;">Channel Volume</p>
              <canvas id="channel-volume-chart"></canvas>
            </div>
            <div style="flex: 1; min-width: 150px; height: 180px;">
              <p style="font-size: 0.75rem; text-align: center; color: var(--text-secondary); margin-bottom: 4px;">Agent Utilization</p>
              <canvas id="agent-util-chart"></canvas>
            </div>
          </div>
        `;
      },
      render: () => {
        const volCtx = document.getElementById('channel-volume-chart');
        const utilCtx = document.getElementById('agent-util-chart');
        
        const volRes = mcpTools.get_live_channel_volume();
        const data = volRes.concurrent_streams;
        
        if (volCtx) {
          createChart(volCtx, {
            type: 'doughnut',
            data: {
              labels: ['Voice', 'Chat', 'Email'],
              datasets: [{
                data: [data.voice, data.chat, data.email],
                backgroundColor: ['#DA291C', '#00f0ff', '#8b5cf6'],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 8, color: '#9ca3af', font: { size: 8 } } } }
            }
          });
        }
        
        if (utilCtx) {
          createChart(utilCtx, {
            type: 'bar',
            data: {
              labels: ['Avail', 'Busy', 'Wrap'],
              datasets: [{
                data: [16, 32, 8],
                backgroundColor: ['#10b981', '#f59e0b', '#8b5cf6'],
                borderRadius: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 7 } } },
                x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 7 } } }
              },
              plugins: { legend: { display: false } }
            }
          });
        }
      }
    },
    'preset-refund-policy': {
      requiredServers: ['sharepoint_kb'],
      steps: [
        {
          title: 'Search SharePoint Knowledge Base',
          tag: 'sharepoint_kb/search',
          desc: 'Search refund dispute policy matches in SharePoint documents.',
          payload: { query: 'refund dispute contract' },
          execute: () => mcpTools.sharepoint_kb_search({ query: 'refund' })
        }
      ],
      generate: () => {
        const matches = mcpTools.sharepoint_kb_search({ query: 'refund' }).document_matches;
        const excerpt = matches[0] ? matches[0].text : 'No policy matches found.';
        
        return `
          <p>I have queried your **SharePoint Knowledge Base** Server via MCP and retrieved the policy document: **\`SOP-Finance-204: Refund Policy (v4)\`**.</p>
          
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; font-size: 0.85rem; line-height: 1.4; margin: 10px 0;">
            <strong style="color: var(--color-cyan); font-size: 0.75rem; text-transform: uppercase;">Retrieved Document Clause:</strong><br>
            "${excerpt}"
          </div>
          
          <p>**Resolution Recommendation:**</p>
          <p>Verify caller contract parameters. If billing errors representing >5% are confirmed, request case filing under 14 days limitation.</p>
        `;
      },
      render: () => {}
    },
    'preset-churn-retention': {
      requiredServers: ['salesforce_crm', 'sharepoint_kb'],
      steps: [
        {
          title: 'Query CRM Support Profile: J*** E***',
          tag: 'salesforce_crm/get_customer_interaction_history',
          desc: 'Retrieve active contract value, lifetime billing history, and calculated churn risk markers.',
          payload: { customer_name: 'Jeff Edwards' },
          execute: () => mcpTools.get_customer_interaction_history({ customer_name: 'Jeff Edwards' })
        },
        {
          title: 'Search SharePoint KB: "retention guidelines"',
          tag: 'sharepoint_kb/search',
          desc: 'Query company policy handbook for customer retention discount credit authorization levels.',
          payload: { query: 'retention policy discounts' },
          execute: () => mcpTools.sharepoint_kb_search({ query: 'retention' })
        }
      ],
      generate: () => {
        const targetName = 'Jeff Edwards';
        return `
          <p>I have queried your **Zendesk CRM** and **SharePoint Knowledge Base** via MCP tools to resolve the churn retention request:</p>
          
          <div class="dashboard-grid">
            <div class="dash-card">
              <h4>Customer Churn Profile</h4>
              <p class="alert" style="color: var(--color-yellow); border-color: rgba(245, 158, 11, 0.2); margin-top: 4px; padding: 2px 6px; font-size: 0.7rem; border-radius: 4px; display: inline-block;">Risk: High (84%)</p>
              <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin-top:8px;">
                Customer: <strong>${maskText(targetName)}</strong><br>
                Contract Value: <strong>$8,400 / yr</strong><br>
                Zendesk Ticket: <strong>#9842 - Pricing Dispute</strong>
              </div>
            </div>
            <div class="dash-card">
              <h4>SharePoint Policy Rule</h4>
              <p style="color: var(--color-green); font-size: 0.7rem; border: 1px solid rgba(16, 185, 129, 0.2); background: rgba(16, 185, 129, 0.05); padding: 2px 6px; border-radius: 4px; display: inline-block; font-weight: 600; margin-top: 4px;">SOP-Retention-409</p>
              <div style="font-size:0.7rem; color:var(--text-muted); line-height:1.4; margin-top:8px;">
                "For active enterprise contract values > $5,000 and churn risk indices exceeding 70%, agents are authorized to offer a service credit discount up to 20% ($1,680 limit) upon approval."
              </div>
            </div>
          </div>
          
          <div class="tandem-card" id="tandem-auth-card">
            <div class="tandem-header">
              <span class="tandem-title">🤝 Tandem Care Checkpoint</span>
              <span class="tandem-badge">Awaiting Authorization</span>
            </div>
            <div class="tandem-body">
              Aura AI proposes executing <code>salesforce_crm/apply_retention_discount</code> to issue a 15% contract billing credit ($1,260 value) to <strong>${maskText(targetName)}</strong>'s active account.
            </div>
            <div class="tandem-footer">
              <button class="tandem-btn decline" onclick="handleTandemDecline('${targetName}')">Decline Offer</button>
              <button class="tandem-btn approve" onclick="handleTandemApprove('${targetName}')">Authorize Credit</button>
            </div>
          </div>
        `;
      },
      render: () => {}
    },
    'preset-incoming-calls': {
      requiredServers: ['postgresql_db', 'salesforce_crm'],
      steps: [
        {
          title: 'Query Monthly Call Database',
          tag: 'postgresql_db/get_monthly_volume',
          desc: 'Fetch total incoming connection counts aggregated by channel for the current calendar month.',
          payload: { month: 'current' },
          execute: () => mcpTools.get_live_channel_volume()
        }
      ],
      generate: () => {
        return `
          <p>I have queried your **PostgreSQL Database** and **Zendesk CRM** servers to retrieve monthly call volume statistics and top enterprise callers:</p>
          <p>Total incoming interactions this month: **14,820**. WebChat remains the most utilized contact channel, representing nearly half of all traffic.</p>
          
          <div class="chart-container-wrapper" style="display: flex; gap: 10px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 180px; height: 180px;">
              <p style="font-size: 0.75rem; text-align: center; color: var(--text-secondary); margin-bottom: 4px;">Volume by Channel</p>
              <canvas id="incoming-channels-chart"></canvas>
            </div>
            <div style="flex: 1; min-width: 180px; height: 180px;">
              <p style="font-size: 0.75rem; text-align: center; color: var(--text-secondary); margin-bottom: 4px;">Top 5 Calling Accounts</p>
              <canvas id="incoming-callers-chart"></canvas>
            </div>
          </div>
        `;
      },
      render: () => {
        const channelCtx = document.getElementById('incoming-channels-chart');
        const callersCtx = document.getElementById('incoming-callers-chart');
        
        if (channelCtx) {
          createChart(channelCtx, {
            type: 'doughnut',
            data: {
              labels: ['Voice', 'Chat', 'Email'],
              datasets: [{
                data: [5410, 7230, 2180],
                backgroundColor: ['#DA291C', '#00f0ff', '#8b5cf6'],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 8, color: '#9ca3af', font: { size: 8 } } } }
            }
          });
        }
        
        if (callersCtx) {
          // Render top accounts directly from current CRM list!
          const counts = [412, 320, 280, 195, 145];
          const labels = localDatabases.salesforce_crm.slice(0, 5).map(c => c.account.split(' ')[0]);
          
          createChart(callersCtx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                data: counts.slice(0, labels.length),
                backgroundColor: '#00f0ff',
                borderRadius: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              scales: {
                y: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 8 } } },
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af', font: { size: 8 } } }
              },
              plugins: { legend: { display: false } }
            }
          });
        }
      }
    }
  };

  let scenario = presetConfig[presetKey];

  if (!scenario && userText) {
    const queryLower = userText.toLowerCase();
    
    // Scenario 1: Customer Interaction History & Activity Lookup
    const foundCustomer = localDatabases.salesforce_crm.find(crm => {
      const nameParts = crm.name.toLowerCase().split(' ');
      return queryLower.includes(crm.name.toLowerCase()) || (nameParts.length > 1 && nameParts[1].length > 2 && queryLower.includes(nameParts[1]));
    });
    
    if (foundCustomer) {
      const isTroubleshoot = queryLower.includes('troubleshoot') || queryLower.includes('jitter') || queryLower.includes('quality') || queryLower.includes('dropped') || queryLower.includes('issue') || queryLower.includes('policy') || queryLower.includes('sop') || queryLower.includes('ticket') || queryLower.includes('problem');
      
      if (isTroubleshoot) {
        scenario = {
          requiredServers: ['salesforce_crm', 'sharepoint_kb'],
          steps: [
            {
              title: `Query CRM History: ${maskText(foundCustomer.name)}`,
              tag: 'salesforce_crm/get_customer_interaction_history',
              desc: `Fetch past contact records, active tickets, and conversation logs.`,
              payload: { customer_name: maskText(foundCustomer.name) },
              execute: () => mcpTools.get_customer_interaction_history({ customer_name: foundCustomer.name })
            },
            {
              title: `Search SharePoint KB: "voice jitter"`,
              tag: 'sharepoint_kb/sharepoint_kb_search',
              desc: `Perform semantic scan on company SOP records for voice quality or jitter rules.`,
              payload: { query: "jitter" },
              execute: () => mcpTools.sharepoint_kb_search({ query: "jitter" })
            }
          ],
          generate: () => {
            const histRes = mcpTools.get_customer_interaction_history({ customer_name: foundCustomer.name });
            const searchRes = mcpTools.sharepoint_kb_search({ query: "jitter" });
            const policyText = searchRes.document_matches[0] ? searchRes.document_matches[0].text : "No policy found.";
            const docTitle = searchRes.document_matches[0] ? searchRes.document_matches[0].title : "SOP-Support-101";

            let html = `<p>I have successfully orchestrated a cross-server resolution using **Zendesk CRM** and **SharePoint Knowledge Base** via MCP tools.</p>`;
            html += `<p>**1. Active Support Case Retrieved:**</p>`;
            html += `<p style="padding-left: 10px; border-left: 2px solid var(--color-cyan); margin: 6px 0; color: var(--text-secondary); font-size: 0.85rem;">`;
            html += `Active Ticket for **${maskText(foundCustomer.name)}**: <strong>${foundCustomer.ticket || 'None'}</strong><br>`;
            html += `Email: <em>${foundCustomer.email}</em> | Account: <em>${foundCustomer.account}</em>`;
            html += `</p>`;

            html += `<p>**2. SharePoint SOP Guidelines Found:**</p>`;
            html += `<div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; font-size: 0.85rem; line-height: 1.4; margin: 10px 0;">`;
            html += `<strong style="color: var(--color-cyan); font-size: 0.75rem; text-transform: uppercase;">📄 ${docTitle}:</strong><br>`;
            html += `"${policyText}"`;
            html += `</div>`;

            html += `<p>**3. AI Resolution Recommendation:**</p>`;
            html += `<ul>`;
            html += `<li>Initiate real-time line diagnostics on SIP trunk logs for **${maskText(foundCustomer.name)}**.</li>`;
            html += `<li>According to **${docTitle}**, if SIP packet loss exceeds 1.0% or round-trip time is >150ms, reroute VoIP audio streams via alternative media gateways immediately.</li>`;
            html += `</ul>`;
            return html;
          },
          render: () => {}
        };
      } else {
        scenario = {
          requiredServers: ['salesforce_crm'],
          steps: [
            {
              title: `Query Customer History: ${maskText(foundCustomer.name)}`,
              tag: 'salesforce_crm/get_customer_interaction_history',
              desc: `Fetch past contact records, tickets, and conversation logs for CRM account.`,
              payload: { customer_name: maskText(foundCustomer.name) },
              execute: () => mcpTools.get_customer_interaction_history({ customer_name: foundCustomer.name })
            }
          ],
          generate: () => {
            const histRes = mcpTools.get_customer_interaction_history({ customer_name: foundCustomer.name });
            const interactions = histRes.interactions;
            
            if (!interactions || interactions.length === 0) {
              return `<p>I queried the CRM history tool for **${maskText(foundCustomer.name)}** but found **no past interaction logs** associated with their profile.</p>`;
            }
            
            let html = `<p>I resolved your query by calling tool <code>salesforce_crm/get_customer_interaction_history</code>. Here is the past contact center history for **${maskText(foundCustomer.name)}** (${foundCustomer.account}):</p>`;
            html += `<div class="silo-table-container" style="max-height: 250px; border: 1px solid var(--border-color); border-radius: 6px; margin: 10px 0;">
              <table class="silo-table">
              <thead>
                <tr><th>Date</th><th>Channel</th><th>Agent</th><th>Conversation Notes</th></tr>
              </thead>
              <tbody>`;
            interactions.forEach(i => {
              html += `<tr>
                <td style="white-space: nowrap;">${i.date}</td>
                <td><span style="color: ${i.channel === 'voice' ? 'var(--color-avaya-red)' : i.channel === 'chat' ? 'var(--color-cyan)' : 'var(--color-purple)'}">${i.channel}</span></td>
                <td style="white-space: nowrap;">${i.agent}</td>
                <td>${i.notes}</td>
              </tr>`;
            });
            html += `</tbody></table></div>`;
            return html;
          },
          render: () => {}
        };
      }
    }
    
    // Scenario 2: SharePoint Policy Search
    if (!scenario && (queryLower.includes('policy') || queryLower.includes('search') || queryLower.includes('kb') || queryLower.includes('warranty') || queryLower.includes('refund') || queryLower.includes('cancellation') || queryLower.includes('grace') || queryLower.includes('bypass') || queryLower.includes('mfa') || queryLower.includes('outage') || queryLower.includes('tax') || queryLower.includes('upgrade') || queryLower.includes('sla') || queryLower.includes('compliance'))) {
      let searchTerm = 'policy';
      const terms = ['refund', 'warranty', 'cancellation', 'grace', 'mfa', 'bypass', 'outage', 'tax', 'exemption', 'upgrade', 'downgrade', 'sla', 'compliance', 'jitter', 'load balance'];
      for (const t of terms) {
        if (queryLower.includes(t)) {
          searchTerm = t;
          break;
        }
      }
      
      scenario = {
        requiredServers: ['sharepoint_kb'],
        steps: [
          {
            title: `Search SharePoint KB: "${searchTerm}"`,
            tag: 'sharepoint_kb/sharepoint_kb_search',
            desc: `Perform semantic scan on company SOP records and agreements.`,
            payload: { query: searchTerm },
            execute: () => mcpTools.sharepoint_kb_search({ query: searchTerm })
          }
        ],
        generate: () => {
          const searchRes = mcpTools.sharepoint_kb_search({ query: searchTerm });
          const matches = searchRes.document_matches;
          
          if (matches.length === 0) {
            return `<p>I queried the SharePoint Knowledge Base via MCP for terms matching <strong>"${searchTerm}"</strong>, but no document clauses were returned. Please try another query term.</p>`;
          }
          
          let html = `<p>I ran tool <code>sharepoint_kb/sharepoint_kb_search</code> and retrieved **${matches.length} matching policy documents** from your enterprise repository:</p>`;
          
          matches.forEach(m => {
            html += `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 10px 14px; border-radius: 8px; margin: 8px 0; font-size: 0.825rem; text-align: left;">
                <strong style="color: var(--color-cyan); font-size: 0.725rem; text-transform: uppercase;">📄 ${m.title}:</strong><br>
                "${m.text}"
              </div>
            `;
          });
          return html;
        },
        render: () => {}
      };
    }

    // Scenario 3: Wait Time Database Check
    if (!scenario && (queryLower.includes('wait') || queryLower.includes('spike') || queryLower.includes('metrics') || queryLower.includes('time') || queryLower.includes('calls') || queryLower.includes('average'))) {
      scenario = presetConfig['preset-wait-time'];
    }

    // Scenario 4: VIP Queue Priority Check / Escalation proposals
    if (!scenario && (queryLower.includes('vip') || queryLower.includes('escalate') || queryLower.includes('sla') || queryLower.includes('queue'))) {
      scenario = presetConfig['preset-vip-escalate'];
    }

    // Scenario 5: Channel Volume Dashboard Check
    if (!scenario && (queryLower.includes('volume') || queryLower.includes('channel') || queryLower.includes('dashboard') || queryLower.includes('utilization') || queryLower.includes('agent'))) {
      scenario = presetConfig['preset-agent-util'];
    }
  }

  if (!scenario) {
    // Normal query with no matching scenario
    await sleep(1000);
    appendMessage('assistant', "I processed your query, but no active database metrics match your prompt. To see the full capabilities of Avaya's MCP integration, please click on one of the **Supervisor Presets** in the chat console or ask questions about 'wait times', 'VIP escalation', 'refund policies', or look up a specific customer name's 'contact history'.", 'A');
    return;
  }

  // Check online active servers
  let offlineList = [];
  scenario.requiredServers.forEach(srv => {
    if (!state.activeServers[srv]) {
      let name = srv === 'postgresql_db' ? 'PostgreSQL' : srv === 'salesforce_crm' ? 'Zendesk CRM' : 'SharePoint KB';
      offlineList.push(name);
    }
  });

  if (offlineList.length > 0) {
    await sleep(1000);
    addAuditLog('warning', 'Gateway', `Failed tool execution. Target servers offline: ${offlineList.join(', ')}`);
    const errorResponse = `
      <p style="color: var(--color-avaya-red); font-weight: 500;">⚠ MCP Gateway Tool Routing Error</p>
      <p>I attempted to run calculations to resolve your query, but the following required MCP servers are currently offline:</p>
      <p>• **${offlineList.join('**<br>• **')}**</p>
      <p>Please toggle these servers back on using the **Active MCP Servers** bar at the bottom and try again.</p>
    `;
    appendMessage('assistant', errorResponse, 'A');
    return;
  }

  // Iterate trace steps
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    addAuditLog('info', 'Model', `LLM model requested tool call: ${step.tag}`);
    
    // Render Step
    const stepDiv = document.createElement('div');
    stepDiv.className = 'trace-step active';
    stepDiv.innerHTML = `
      <div class="step-marker">${i + 2}</div>
      <div class="step-details">
        <div class="step-header">
          <h3 class="step-title">${step.title}</h3>
          <span class="step-tag" style="color: var(--color-cyan);">${step.tag}</span>
        </div>
        <p class="step-desc">${step.desc}</p>
        <pre class="json-payload">${JSON.stringify(maskPayload(step.payload), null, 2)}</pre>
      </div>
    `;
    traceStepsContainer.appendChild(stepDiv);
    tabPanelTrace.scrollTop = tabPanelTrace.scrollHeight;
    
    triggerArchVisualTransmission(step.tag);
    await sleep(1500);

    // Call execution logic (evaluates compliance settings!)
    try {
      const output = step.execute();
      stepDiv.className = 'trace-step completed';
      const payloadPre = stepDiv.querySelector('.json-payload');
      payloadPre.style.color = '#10b981';
      payloadPre.innerText = JSON.stringify(output, null, 2);
      
      addAuditLog('success', 'Server', `Tool call succeeded. Returned structured data from ${step.tag}`);
    } catch (err) {
      // Catalog Restrict Policy matches here
      stepDiv.className = 'trace-step completed';
      const payloadPre = stepDiv.querySelector('.json-payload');
      payloadPre.style.color = 'var(--color-avaya-red)';
      payloadPre.innerText = `{\n  "error": "${err.message}"\n}`;
      addAuditLog('warning', 'Audit', `Access Blocked: ${err.message}`);
      
      await sleep(1000);
      const errorMsg = `
        <p style="color: var(--color-avaya-red); font-weight: 500;">⚠ Databricks Security Exception</p>
        <p>Your query was blocked by central compliance rules:</p>
        <p style="padding:8px 12px; background:rgba(218,41,28,0.05); border:1px solid var(--border-color-glow); border-radius:6px; font-family:var(--font-mono); font-size:0.8rem;">
          ${err.message}
        </p>
        <p>Please open the **Configurations Modal** (gear icon) and uncheck "Restrict Call DB Access" to authorize this tool call.</p>
      `;
      appendMessage('assistant', errorMsg, 'A');
      return;
    }

    await sleep(800);
  }

  // Render Response
  addAuditLog('info', 'Model', 'Model formulating final markdown responses.');
  await sleep(1000);
  appendMessage('assistant', scenario.generate(), 'A');
  scenario.render();
}

// ----------------------------------------------------
// MODE 2: Live Gemini API Tool Loop (Online Mode)
// ----------------------------------------------------
async function runLiveGeminiToolLoop(userPrompt) {
  if (!state.geminiApiKey) {
    await sleep(800);
    const errorResponse = `
      <p style="color: var(--color-avaya-red); font-weight: 500;">⚠ API Key Missing</p>
      <p>You have enabled **Live Gemini API Mode**, but no API key was provided.</p>
      <p>Please click the **Settings Gear Icon** at the top right, enter your Gemini API Key, and save configurations to run live queries.</p>
    `;
    appendMessage('assistant', errorResponse, 'A');
    addAuditLog('warning', 'Client', 'Gemini API call failed: Missing API Key.');
    return;
  }

  // Official Gemini Tool Definitions
  const toolsDeclaration = [
    {
      functionDeclarations: [
        {
          name: 'query_call_metrics',
          description: 'Query database call logs for customer names, wait times, and contact channels. Use this when analyzing wait time spikes or general database summaries.',
          parameters: {
            type: 'OBJECT',
            properties: {
              start_time: { type: 'STRING', description: 'Start time filter, e.g. "13:00"' },
              end_time: { type: 'STRING', description: 'End time filter, e.g. "15:00"' }
            },
            required: ['start_time', 'end_time']
          }
        },
        {
          name: 'search_vip_queues',
          description: 'Query CRM accounts and live wait times to find VIP customer accounts currently waiting in queue.',
          parameters: {
            type: 'OBJECT',
            properties: {
              max_wait_sec: { type: 'NUMBER', description: 'Wait time threshold in seconds, e.g. 120' }
            },
            required: ['max_wait_sec']
          }
        },
        {
          name: 'get_live_channel_volume',
          description: 'Fetch concurrent incoming logs aggregated by channel (voice, chat, email). Use this when generating channel volume graphs.',
          parameters: {
            type: 'OBJECT',
            properties: {}
          }
        },
        {
          name: 'sharepoint_kb_search',
          description: 'Search SharePoint knowledge base for company rules, SLA policies, and dispute refund regulations.',
          parameters: {
            type: 'OBJECT',
            properties: {
              query: { type: 'STRING', description: 'Keyword query term, e.g. "refund contract"' }
            },
            required: ['query']
          }
        },
        {
          name: 'get_customer_interaction_history',
          description: 'Retrieve a customer past contact center interactions, including timestamps, channels, handling agents, and transcripts or notes.',
          parameters: {
            type: 'OBJECT',
            properties: {
              customer_name: { type: 'STRING', description: 'The exact name of the customer, e.g. "Jeff Edwards"' }
            },
            required: ['customer_name']
          }
        }
      ]
    }
  ];

  // Conversation history array for Gemini API call loops
  let apiMessages = [
    { role: 'user', parts: [{ text: userPrompt }] }
  ];

  const modelName = 'gemini-1.5-flash';
  let loopCount = 0;
  const maxLoops = 5;

  while (loopCount < maxLoops) {
    loopCount++;
    
    // API request endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${state.geminiApiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: apiMessages,
          tools: toolsDeclaration
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ? errorData.error.message : 'Unknown API error');
      }

      const resJson = await response.json();
      
      // Parse response candidate
      const candidate = resJson.candidates[0];
      const content = candidate.content;
      const part = content.parts[0];
      
      // Keep track of messages in API context
      apiMessages.push(content);

      // Check if Model is requesting a function/tool call
      if (part.functionCall) {
        const toolRequest = part.functionCall;
        const toolName = toolRequest.name;
        const toolArgs = toolRequest.args;
        
        // Find which MCP server owns the tool to enforce toggle checks!
        let targetServer = 'postgresql_db';
        if (toolName === 'search_vip_queues' || toolName === 'get_customer_interaction_history') targetServer = 'salesforce_crm';
        else if (toolName === 'sharepoint_kb_search') targetServer = 'sharepoint_kb';
        
        // Render step in trace panel
        const stepIndex = traceStepsContainer.children.length + 2;
        const stepDiv = document.createElement('div');
        stepDiv.className = 'trace-step active';
        stepDiv.innerHTML = `
          <div class="step-marker">${stepIndex}</div>
          <div class="step-details">
            <div class="step-header">
              <h3 class="step-title">API Requested Tool</h3>
              <span class="step-tag" style="color: var(--color-cyan);">${targetServer}/${toolName}</span>
            </div>
            <pre class="json-payload">${JSON.stringify(maskPayload(toolArgs), null, 2)}</pre>
          </div>
        `;
        traceStepsContainer.appendChild(stepDiv);
        tabPanelTrace.scrollTop = tabPanelTrace.scrollHeight;
        
        triggerArchVisualTransmission(toolName);
        addAuditLog('info', 'Model', `Gemini requested tool execution: ${toolName}`);

        await sleep(1500);

        let executionResult = null;

        // Check 1: Is the server switched off?
        if (!state.activeServers[targetServer]) {
          executionResult = { error: `Server Connection Refused: Target server '${targetServer}' is offline.` };
          stepDiv.className = 'trace-step completed';
          const payloadPre = stepDiv.querySelector('.json-payload');
          payloadPre.style.color = 'var(--color-avaya-red)';
          payloadPre.innerText = JSON.stringify(executionResult, null, 2);
          addAuditLog('warning', 'Gateway', `Tool connection refused. Server offline: ${targetServer}`);
        } else {
          // Check 2: Execute actual tool & check Databricks Policies
          try {
            if (toolName === 'query_call_metrics') {
              executionResult = mcpTools.query_call_metrics(toolArgs);
            } else if (toolName === 'search_vip_queues') {
              executionResult = mcpTools.search_vip_queues(toolArgs);
            } else if (toolName === 'get_live_channel_volume') {
              executionResult = mcpTools.get_live_channel_volume();
            } else if (toolName === 'sharepoint_kb_search') {
              executionResult = mcpTools.sharepoint_kb_search(toolArgs);
            } else if (toolName === 'get_customer_interaction_history') {
              executionResult = mcpTools.get_customer_interaction_history(toolArgs);
            }
            
            stepDiv.className = 'trace-step completed';
            const payloadPre = stepDiv.querySelector('.json-payload');
            payloadPre.style.color = '#10b981';
            payloadPre.innerText = JSON.stringify(executionResult, null, 2);
            addAuditLog('success', 'Server', `Tool executed. Exposing database metrics to model.`);
          } catch (err) {
            // Lockout policy triggered
            executionResult = { error: err.message };
            stepDiv.className = 'trace-step completed';
            const payloadPre = stepDiv.querySelector('.json-payload');
            payloadPre.style.color = 'var(--color-avaya-red)';
            payloadPre.innerText = JSON.stringify(executionResult, null, 2);
            addAuditLog('warning', 'Audit', `Blocked access: ${err.message}`);
          }
        }

        // Return tool results back to Gemini context
        apiMessages.push({
          role: 'user', // In Gemini api, tool responses are submitted under the user role with a 'functionResponse' part
          parts: [{
            functionResponse: {
              name: toolName,
              response: { name: toolName, content: executionResult }
            }
          }]
        });

        await sleep(1000);
        // Loop again to send the tool result payload back to Gemini
      } else {
        // No more tool calls; Model returned final text response!
        addAuditLog('success', 'Model', 'Final generation complete. Mapping response UI.');
        
        let textResult = part.text || 'Unable to generate response.';
        appendMessage('assistant', formatMarkdownText(textResult), 'A');
        
        // Post-render analytics charts if model generated text mentioning them
        checkForAndRenderDynamicCharts(textResult);
        break;
      }
    } catch (err) {
      addAuditLog('warning', 'Client', `API Loop Error: ${err.message}`);
      const errBubble = `
        <p style="color: var(--color-avaya-red); font-weight:500;">⚠ Gemini API Connection Error</p>
        <p>An error occurred while communicating with the Gemini endpoint:</p>
        <p style="padding:8px; border:1px solid var(--border-color); font-family:var(--font-mono); font-size:0.75rem; background:rgba(0,0,0,0.1);">${err.message}</p>
        <p>Verify your API key is correct and that your system has internet access.</p>
      `;
      appendMessage('assistant', errBubble, 'A');
      break;
    }
  }
}

// Simple text renderer to handle markdown bold tags
function formatMarkdownText(text) {
  // Protect sequences of 3 or more asterisks (like J*** E***) from being eaten by markdown bold/italic regex
  let protectedText = text.replace(/\*{3,}/g, (match) => {
    return `__AST_${match.length}__`;
  });
  
  // Strip newlines directly between HTML tags (e.g. >\n< or >\n  <) to prevent invalid <br> tags in tables/divs
  let cleaned = protectedText.replace(/>\s*\n\s*</g, '><');
  let formatted = cleaned
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="font-family:var(--font-mono); background:rgba(255,255,255,0.05); padding:2px 4px; border-radius:4px;">$1</code>')
    .replace(/\n/g, '<br>');
    
  // Restore the protected asterisks
  let restored = formatted.replace(/__AST_(\d+)__/g, (match, p1) => {
    return '*'.repeat(parseInt(p1));
  });
  return restored;
}

// Scans text for keywords to draw visual charts on-the-fly for live API queries
function checkForAndRenderDynamicCharts(text) {
  const lText = text.toLowerCase();
  
  if (lText.includes('wait') || lText.includes('chart')) {
    // If the text contains references to wait times, inject a canvas chart container
    const bubbles = chatHistory.querySelectorAll('.msg-bubble');
    const lastBubble = bubbles[bubbles.length - 1];
    
    if (lastBubble && !lastBubble.querySelector('canvas')) {
      const container = document.createElement('div');
      container.className = 'chart-container-wrapper';
      container.innerHTML = `<canvas id="gemini-live-chart" style="width: 100%; height: 180px;"></canvas>`;
      lastBubble.appendChild(container);
      
      const ctx = document.getElementById('gemini-live-chart');
      
      // Plot call logs directly from our PostgreSQL array state
      const labels = localDatabases.postgresql_db.map(l => l.time);
      const data = localDatabases.postgresql_db.map(l => l.wait);
      
      createChart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Wait Time (sec)',
            data: data,
            borderColor: '#DA291C',
            backgroundColor: 'rgba(218, 41, 28, 0.15)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af', font: { size: 9 } } },
            x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af', font: { size: 9 } } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }
}

// ----------------------------------------------------
// Interactive Architecture Diagram (HTML Canvas Drawing)
// ----------------------------------------------------
let canvas = document.getElementById('architecture-canvas');
let ctx = canvas.getContext('2d');
let animationId = null;
let particles = [];

// Base node coordinates
let nodes = {
  models: [
    { x: 80, y: 70, name: 'Claude 3.5' },
    { x: 80, y: 160, name: 'Gemini 1.5' },
    { x: 80, y: 250, name: 'GPT-4o' }
  ],
  mcpBus: { x: 250, y: 160, name: 'Avaya Infinity Gateway (MCP)' },
  repositories: [
    { x: 420, y: 60, name: 'Call Log DB' },
    { x: 420, y: 125, name: 'Zendesk CRM' },
    { x: 420, y: 195, name: 'SharePoint KB' },
    { x: 420, y: 260, name: 'Billing ERP' }
  ]
};

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width || 500;
  canvas.height = rect.height || 320;
  
  const w = canvas.width;
  const h = canvas.height;
  
  nodes.models[0].x = w * 0.15; nodes.models[0].y = h * 0.22;
  nodes.models[1].x = w * 0.15; nodes.models[1].y = h * 0.50;
  nodes.models[2].x = w * 0.15; nodes.models[2].y = h * 0.78;
  
  nodes.mcpBus.x = w * 0.5; nodes.mcpBus.y = h * 0.5;
  
  nodes.repositories[0].x = w * 0.85; nodes.repositories[0].y = h * 0.15;
  nodes.repositories[1].x = w * 0.85; nodes.repositories[1].y = h * 0.38;
  nodes.repositories[2].x = w * 0.85; nodes.repositories[2].y = h * 0.62;
  nodes.repositories[3].x = w * 0.85; nodes.repositories[3].y = h * 0.85;
}

window.addEventListener('resize', () => {
  if (tabPanelArch.classList.contains('active')) {
    resizeCanvas();
  }
});

toggleArchLegacy.addEventListener('click', () => {
  state.archMode = 'legacy';
  toggleArchLegacy.classList.add('active');
  toggleArchMcp.classList.remove('active');
  archConnectionsCount.innerHTML = '<span style="color:var(--color-avaya-red);">12</span> (Complex integration mess)';
  addAuditLog('info', 'Gateway', 'Architecture diagram toggled to Legacy N x M Direct integrations.');
});

toggleArchMcp.addEventListener('click', () => {
  state.archMode = 'mcp';
  toggleArchMcp.classList.add('active');
  toggleArchLegacy.classList.remove('active');
  archConnectionsCount.innerHTML = '<span style="color:var(--color-cyan);">7</span> (Clean unified bus)';
  addAuditLog('info', 'Gateway', 'Architecture diagram toggled to Avaya Infinity N+M MCP standard.');
});

function triggerArchVisualTransmission(toolTag) {
  let targetIndex = 0;
  if (toolTag.includes('postgresql_db') || toolTag.includes('call_metrics')) targetIndex = 0;
  else if (toolTag.includes('salesforce_crm') || toolTag.includes('vip')) targetIndex = 1;
  else if (toolTag.includes('sharepoint_kb') || toolTag.includes('search')) targetIndex = 2;
  
  const activeModelNode = nodes.models[1]; // Represents Gemini
  const targetRepoNode = nodes.repositories[targetIndex];
  
  if (state.archMode === 'mcp') {
    spawnParticlesPath(activeModelNode, nodes.mcpBus, 5);
    setTimeout(() => {
      spawnParticlesPath(nodes.mcpBus, targetRepoNode, 5);
    }, 300);
  } else {
    spawnParticlesPath(activeModelNode, targetRepoNode, 8);
  }
}

function spawnParticlesPath(start, end, count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: start.x,
      y: start.y,
      targetX: end.x,
      targetY: end.y,
      speed: 2 + Math.random() * 2,
      progress: 0,
      color: state.archMode === 'mcp' ? '#00f0ff' : '#f59e0b'
    });
  }
}

function drawArchDiagram() {
  if (!tabPanelArch.classList.contains('active')) {
    animationId = requestAnimationFrame(drawArchDiagram);
    return;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const mode = state.archMode;
  
  // Background grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 20) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
  }
  for (let j = 0; j < canvas.height; j += 20) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
  }

  // Wires
  ctx.lineWidth = 1.5;
  if (mode === 'legacy') {
    nodes.models.forEach(model => {
      nodes.repositories.forEach(repo => {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
        ctx.beginPath(); ctx.moveTo(model.x, model.y); ctx.lineTo(repo.x, repo.y); ctx.stroke();
      });
    });
  } else {
    nodes.models.forEach(model => {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.beginPath(); ctx.moveTo(model.x, model.y); ctx.lineTo(nodes.mcpBus.x, nodes.mcpBus.y); ctx.stroke();
    });
    nodes.repositories.forEach(repo => {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.beginPath(); ctx.moveTo(nodes.mcpBus.x, nodes.mcpBus.y); ctx.lineTo(repo.x, repo.y); ctx.stroke();
    });
  }

  // Flowing dots
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.progress += 0.02 * p.speed;
    p.x = p.x + (p.targetX - p.x) * 0.1;
    p.y = p.y + (p.targetY - p.y) * 0.1;
    
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    
    const distance = Math.hypot(p.targetX - p.x, p.targetY - p.y);
    if (distance < 2 || p.progress >= 1) {
      particles.splice(i, 1);
    }
  }

  // Nodes
  nodes.models.forEach(model => drawNode(model.x, model.y, model.name, 'model'));
  nodes.repositories.forEach(repo => drawNode(repo.x, repo.y, repo.name, 'repo'));
  if (mode === 'mcp') drawNode(nodes.mcpBus.x, nodes.mcpBus.y, nodes.mcpBus.name, 'mcpBus');

  animationId = requestAnimationFrame(drawArchDiagram);
}

function drawNode(x, y, label, type) {
  let mainColor = '#f3f4f6';
  let size = 12;
  let shadow = 'rgba(255, 255, 255, 0.1)';
  
  if (type === 'model') {
    mainColor = 'var(--color-purple)';
    shadow = 'rgba(139, 92, 246, 0.4)';
    size = 14;
  } else if (type === 'repo') {
    mainColor = 'var(--color-cyan)';
    shadow = 'rgba(0, 240, 255, 0.4)';
    size = 14;
  } else if (type === 'mcpBus') {
    mainColor = 'var(--color-avaya-red)';
    shadow = 'var(--color-avaya-red-glow)';
    size = 20;
  }

  ctx.fillStyle = shadow;
  ctx.beginPath(); ctx.arc(x, y, size + 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = mainColor;
  ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#f3f4f6';
  ctx.font = '600 10px Outfit';
  ctx.textAlign = 'center';
  
  if (type === 'mcpBus') {
    ctx.fillText(label, x, y - (size + 12));
  } else if (x < canvas.width / 2) {
    ctx.textAlign = 'right';
    ctx.fillText(label, x - (size + 8), y + 4);
  } else {
    ctx.textAlign = 'left';
    ctx.fillText(label, x + (size + 8), y + 4);
  }
}

function initArchCanvas() {
  if (animationId) cancelAnimationFrame(animationId);
  resizeCanvas();
  
  // Idle transmission particles simulation
  setInterval(() => {
    if (!tabPanelArch.classList.contains('active')) return;
    // Do not spawn random particles if Edify flow is showing to prevent canvas updates running in background
    if (subTabEdifyBtn && subTabEdifyBtn.classList.contains('active')) return;
    
    const model = nodes.models[Math.floor(Math.random() * nodes.models.length)];
    const repo = nodes.repositories[Math.floor(Math.random() * nodes.repositories.length)];
    
    if (state.archMode === 'mcp') {
      spawnParticlesPath(model, nodes.mcpBus, 1);
      setTimeout(() => spawnParticlesPath(nodes.mcpBus, repo, 1), 500);
    } else {
      spawnParticlesPath(model, repo, 1);
    }
  }, 1200);

  drawArchDiagram();
}

// ----------------------------------------------------
// Tandem Care (Human-in-the-Loop) Interactive Handlers
// ----------------------------------------------------
window.handleTandemApprove = function(customerName) {
  const card = document.getElementById('tandem-auth-card');
  if (!card) return;
  
  if (customerName === 'Jeff Edwards') {
    card.className = 'tandem-card authorized';
    card.querySelector('.tandem-badge').innerText = 'Authorized';
    
    card.querySelector('.tandem-body').innerHTML = `
      <strong>Action Dispatched:</strong> Retention service credit (15% billing discount) was authorized by Supervisor Sarah. Rerouting tool call <code>salesforce_crm/apply_retention_discount</code> executed against Unity Catalog catalog permissions.
    `;
    card.querySelector('.tandem-footer').style.display = 'none';
    
    addAuditLog('success', 'Tandem', `Supervisor Sarah authorized a 15% service credit discount for customer: Jeff Edwards`);
    
    triggerArchVisualTransmission('salesforce_crm/apply_retention_discount');
    
    setTimeout(() => {
      appendMessage('assistant', `I have successfully updated the CRM record for **${maskText('Jeff Edwards')}** and applied a 15% monthly billing discount to prevent account cancellation. The Databricks compliance audit log has been updated.`, 'A');
    }, 1500);
    return;
  }
  
  card.className = 'tandem-card authorized';
  card.querySelector('.tandem-badge').innerText = 'Authorized';
  
  const res = mcpTools.search_vip_queues({ max_wait_sec: 120 });
  const vips = res.active_vip_waiting;
  
  let namesStr = '';
  if (vips.length === 1) {
    namesStr = `**${vips[0].name}**`;
  } else if (vips.length === 2) {
    namesStr = `**${vips[0].name}** and **${vips[1].name}**`;
  } else if (vips.length > 2) {
    const mainNames = vips.slice(0, -1).map(v => `**${v.name}**`).join(', ');
    namesStr = `${mainNames}, and **${vips[vips.length - 1].name}**`;
  } else {
    namesStr = `**${customerName}**`;
  }
  
  card.querySelector('.tandem-body').innerHTML = `
    <strong>Action Dispatched:</strong> Queue escalation was authorized by Supervisor Sarah. Rerouting tool call <code>salesforce_crm/escalate_priority</code> executed against Unity Catalog catalog permissions.
  `;
  card.querySelector('.tandem-footer').style.display = 'none';
  
  addAuditLog('success', 'Tandem', `Supervisor Sarah authorized queue escalation for customer(s): ${vips.map(v => v.name).join(', ')}`);
  
  triggerArchVisualTransmission('salesforce_crm/escalate_priority');
  
  setTimeout(() => {
    appendMessage('assistant', `I have successfully escalated the queue priority for ${namesStr}. They have been rerouted to L3 specialized support. The Unity Catalog compliance audit trail has been archived.`, 'A');
  }, 1500);
};

window.handleTandemDecline = function(customerName) {
  const card = document.getElementById('tandem-auth-card');
  if (!card) return;
  
  if (customerName === 'Jeff Edwards') {
    card.className = 'tandem-card declined';
    card.querySelector('.tandem-badge').innerText = 'Declined';
    
    card.querySelector('.tandem-body').innerHTML = `
      <strong>Action Blocked:</strong> Retention service credit discount declined by Supervisor Sarah. No discount terms have been added.
    `;
    card.querySelector('.tandem-footer').style.display = 'none';
    
    addAuditLog('warning', 'Tandem', `Supervisor Sarah declined the retention discount offer for customer: Jeff Edwards`);
    
    setTimeout(() => {
      appendMessage('assistant', `Understood. The retention service credit discount for **${maskText('Jeff Edwards')}** was declined. I will notify the account manager to initiate standard cancellation procedures.`, 'A');
    }, 1000);
    return;
  }
  
  card.className = 'tandem-card declined';
  card.querySelector('.tandem-badge').innerText = 'Declined';
  
  const res = mcpTools.search_vip_queues({ max_wait_sec: 120 });
  const vips = res.active_vip_waiting;
  
  let namesStr = '';
  if (vips.length === 1) {
    namesStr = `**${vips[0].name}**`;
  } else if (vips.length === 2) {
    namesStr = `**${vips[0].name}** and **${vips[1].name}**`;
  } else if (vips.length > 2) {
    const mainNames = vips.slice(0, -1).map(v => `**${v.name}**`).join(', ');
    namesStr = `${mainNames}, and **${vips[vips.length - 1].name}**`;
  } else {
    namesStr = `**${customerName}**`;
  }
  
  card.querySelector('.tandem-body').innerHTML = `
    <strong>Action Blocked:</strong> Escalation request declined by Supervisor Sarah. The customer remains in their standard priority queue.
  `;
  card.querySelector('.tandem-footer').style.display = 'none';
  
  addAuditLog('warning', 'Tandem', `Supervisor Sarah declined queue escalation request for customer(s): ${vips.map(v => v.name).join(', ')}`);
  
  setTimeout(() => {
    appendMessage('assistant', `Understood. The queue escalation for ${namesStr} was declined. I will monitor the queue and alert you if wait times degrade further.`, 'A');
  }, 1000);
};

// ----------------------------------------------------
// Edify Journey Flowchart Simulation
// ----------------------------------------------------
let edifyIntervalId = null;

const nodeDetails = {
  customer: `
    <strong>[TELEMETRY: Incoming CX Stream]</strong><br>
    Active Channels: Voice (SIP Gateway) & WebRTC WebChat sockets. Incoming caller verified via ANI (Automatic Number Identification) mapping. Core SIP signals: G.711 codec, 16kHz audio sample rate.
  `,
  orchestrator: `
    <strong>[TELEMETRY: Edify Policy Engine]</strong><br>
    Evaluating SLA conditions. Routing matrix checked: Peak volume tier routing applied. Low-code policy flowchart: Checks operational business hours ➔ VIP tier status check ➔ Agent queue load balancing.
  `,
  'mcp-gateway': `
    <strong>[TELEMETRY: MCP Secure Gateway]</strong><br>
    Gateway status: Secure. Protocol schemas registered: 4 tools exposed. Unity Catalog credential check: Token valid. Securely routing CRM SELECT and DB query payloads with zero ETL overhead.
  `,
  'tandem-care': `
    <strong>[TELEMETRY: Tandem Care Hub]</strong><br>
    Collaboration status: Active. LLM suggestions active (Gemini-1.5-Pro). Policy checkpoint: High-value tier queues configured for human supervisor verification.
  `
};

function updateEdifyDetailsCard(node) {
  if (edifyNodeDetailsCard && nodeDetails[node]) {
    edifyNodeDetailsCard.innerHTML = nodeDetails[node];
  }
}

function initEdifyJourneySimulation() {
  if (edifyIntervalId) clearInterval(edifyIntervalId);
  
  const nodesList = ['customer', 'orchestrator', 'mcp-gateway', 'tandem-care'];
  const nodeElements = {
    customer: edifyFlowchartWrapper.querySelector('[data-node="customer"]'),
    orchestrator: edifyFlowchartWrapper.querySelector('[data-node="orchestrator"]'),
    'mcp-gateway': edifyFlowchartWrapper.querySelector('[data-node="mcp-gateway"]'),
    'tandem-care': edifyFlowchartWrapper.querySelector('[data-node="tandem-care"]')
  };
  
  let activeIndex = 0;
  
  nodesList.forEach(node => {
    if (nodeElements[node]) nodeElements[node].classList.remove('active-packet');
  });
  if (nodeElements[nodesList[0]]) nodeElements[nodesList[0]].classList.add('active-packet');
  updateEdifyDetailsCard(nodesList[0]);
  
  edifyIntervalId = setInterval(() => {
    if (nodeElements[nodesList[activeIndex]]) {
      nodeElements[nodesList[activeIndex]].classList.remove('active-packet');
    }
    
    activeIndex = (activeIndex + 1) % nodesList.length;
    
    if (nodeElements[nodesList[activeIndex]]) {
      nodeElements[nodesList[activeIndex]].classList.add('active-packet');
    }
    updateEdifyDetailsCard(nodesList[activeIndex]);
  }, 2500);
}

function switchArchSubTab(target) {
  if (target === 'network') {
    subTabNetworkBtn.classList.add('active');
    subTabEdifyBtn.classList.remove('active');
    archNetworkControls.style.display = 'flex';
    canvasWrapper.style.display = 'block';
    edifyFlowchartWrapper.style.display = 'none';
    
    initArchCanvas();
  } else if (target === 'edify') {
    subTabNetworkBtn.classList.remove('active');
    subTabEdifyBtn.classList.add('active');
    archNetworkControls.style.display = 'none';
    canvasWrapper.style.display = 'none';
    edifyFlowchartWrapper.style.display = 'flex';
    
    if (animationId) cancelAnimationFrame(animationId);
    initEdifyJourneySimulation();
  }
}

// ----------------------------------------------------
// UI Submissions Event Bindings
// ----------------------------------------------------
// ----------------------------------------------------
// Window Initializers & Event Bindings
// ----------------------------------------------------
window.onload = () => {
  try {
    // Bind chat events
    if (chatSendBtn) chatSendBtn.addEventListener('click', () => handleSendMessage());
    if (chatInputField) {
      chatInputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
      });
    }

    // Bind preset triggers
    const binds = {
      'preset-wait-time': 'preset-wait-time',
      'preset-vip-escalate': 'preset-vip-escalate',
      'preset-agent-util': 'preset-agent-util',
      'preset-refund-policy': 'preset-refund-policy',
      'preset-churn-retention': 'preset-churn-retention'
    };
    
    Object.keys(binds).forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => handleSendMessage(binds[id]));
      } else {
        console.warn(`Element with ID '${id}' not found for event binding.`);
      }
    });

    loadStoredSettings();
    updateSystemState();
    renderDataSiloTables();
    
    // Expose pre-load logs
    addAuditLog('info', 'Gateway', 'Secure gateway initialized on localhost:8080. Zero-Trust check passed.');
    addAuditLog('success', 'Audit', 'Databricks Unity Catalog logs linked. Compliance policy verified.');
    addAuditLog('info', 'MCP', 'Initialized server registries: PostgreSQL Call DB, Zendesk CRM Server, SharePoint KB Server.');

// ----------------------------------------------------
// Session History (Pre-populated conversational audits)
// ----------------------------------------------------
let currentSession = 'AV-9842';
const sessionsHTML = {
  'AV-9842': '', // Current active session will be stored dynamically
  'AV-9841': `
    <div class="message assistant">
      <div class="msg-avatar">A</div>
      <div class="msg-bubble">
        <p>Welcome to the **Avaya Infinity MCP Orchestration Dashboard**. I am your Aura AI agent, dynamically mapped to your communications ecosystem via open MCP standards.</p>
        <p>I have secure, read-write access to connected databases, CRMs, and knowledge repositories, audited via **Databricks Unity Catalog**. How can I help you optimize your contact center operations today?</p>
      </div>
    </div>
    <div class="message user">
      <div class="msg-avatar">U</div>
      <div class="msg-bubble">
        <p>A wait-time spike occurred around 2 PM today. Cross-reference call records with agent logs and CRM accounts to find the cause.</p>
      </div>
    </div>
    <div class="message assistant">
      <div class="msg-avatar">A</div>
      <div class="msg-bubble">
        <p>I completed the query using your **PostgreSQL Database** and **Zendesk CRM** servers via MCP. Here is what I discovered:</p>
        <p>A severe wait-time spike occurred starting at **14:00 (2:00 PM)**, peaking at **162 seconds**. At this hour, active agent count dropped from **42** down to **18**.</p>
        
        <div class="chart-container-wrapper">
          <canvas id="historical-wait-chart" style="width: 100%; height: 180px;"></canvas>
        </div>
        
        <p>**Primary Cause Identified:**</p>
        <p style="padding-left: 10px; border-left: 2px solid var(--color-yellow); margin: 6px 0; color: var(--text-secondary); font-size: 0.85rem;">
          Zendesk CRM reports indicate a mandatory training webinar on "Avaya Infinity Updates" took place from 14:00 to 14:45. This automatically pulled 15 agents from active queues while 12 other agents were concurrently scheduled for breaks.
        </p>
        <p>**Resolution Actions Taken via CRM Tool Call:**</p>
        <ul>
          <li>Triggered schedule warning to block concurrent break schedules during training webinars.</li>
          <li>Diverted chat volumes to digital self-service lanes.</li>
        </ul>
      </div>
    </div>
  `,
  'AV-9840': `
    <div class="message assistant">
      <div class="msg-avatar">A</div>
      <div class="msg-bubble">
        <p>Welcome to the **Avaya Infinity MCP Orchestration Dashboard**. I am your Aura AI agent, dynamically mapped to your communications ecosystem via open MCP standards.</p>
        <p>I have secure, read-write access to connected databases, CRMs, and knowledge repositories, audited via **Databricks Unity Catalog**. How can I help you optimize your contact center operations today?</p>
      </div>
    </div>
    <div class="message user">
      <div class="msg-avatar">U</div>
      <div class="msg-bubble">
        <p>A customer wants a refund on a disputed contract. Check our SharePoint Knowledge Base for the refund eligibility policy.</p>
      </div>
    </div>
    <div class="message assistant">
      <div class="msg-avatar">A</div>
      <div class="msg-bubble">
        <p>I have queried your **SharePoint Knowledge Base** Server via MCP and retrieved the policy document: **\`SOP-Finance-204: Refund Policy (v4)\`**.</p>
        
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; font-size: 0.85rem; line-height: 1.4; margin: 10px 0;">
          <strong style="color: var(--color-cyan); font-size: 0.75rem; text-transform: uppercase;">Retrieved Document Clause:</strong><br>
          "Refunds for contractual disputes are eligible only if: (a) SLA was missed by >24 hrs, or (b) Billing discrepancy represents >5% of monthly recurring cost. All requests must be processed within 14 calendar days of case filing."
        </div>
        
        <p>**Resolution Recommendation:**</p>
        <p>Verify caller contract parameters. If billing errors representing >5% are confirmed, request case filing under 14 days limitation.</p>
      </div>
    </div>
  `
};

function renderHistoricalChart(session) {
  if (session === 'AV-9841') {
    const ctx = document.getElementById('historical-wait-chart');
    if (!ctx) return;
    
    createChart(ctx, {
      type: 'line',
      data: {
        labels: ['13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00'],
        datasets: [{
          label: 'Avg Wait (sec)',
          data: [12, 14, 18, 30, 148, 162, 155, 34, 18],
          borderColor: '#DA291C',
          backgroundColor: 'rgba(218, 41, 28, 0.15)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af', font: { size: 9 } } },
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af', font: { size: 9 } } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
}

function restoreActiveSessionCharts() {
  const waitCtx = document.getElementById('wait-time-chart');
  if (waitCtx) {
    const logs = localDatabases.postgresql_db.filter(log => log.time >= '13:00' && log.time <= '15:00');
    const labels = logs.map(l => l.time);
    const data = logs.map(l => l.wait);
    createChart(waitCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Avg Wait (sec)',
          data: data,
          borderColor: '#DA291C',
          backgroundColor: 'rgba(218, 41, 28, 0.15)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af', font: { size: 9 } } },
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af', font: { size: 9 } } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  const volCtx = document.getElementById('channel-volume-chart');
  const utilCtx = document.getElementById('agent-util-chart');
  if (volCtx || utilCtx) {
    const volRes = mcpTools.get_live_channel_volume();
    const data = volRes.concurrent_streams;
    if (volCtx) {
      createChart(volCtx, {
        type: 'doughnut',
        data: {
          labels: ['Voice', 'Chat', 'Email'],
          datasets: [{
            data: [data.voice, data.chat, data.email],
            backgroundColor: ['#DA291C', '#00f0ff', '#8b5cf6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 8, color: '#9ca3af', font: { size: 8 } } } }
        }
      });
    }
    if (utilCtx) {
      createChart(utilCtx, {
        type: 'bar',
        data: {
          labels: ['Avail', 'Busy', 'Wrap'],
          datasets: [{
            data: [16, 32, 8],
            backgroundColor: ['#10b981', '#f59e0b', '#8b5cf6'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 7 } } },
            x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 7 } } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }
}

function switchSession(selected) {
  if (currentSession === 'AV-9842') {
    sessionsHTML['AV-9842'] = chatHistory.innerHTML;
  }
  
  currentSession = selected;
  chatHistory.innerHTML = sessionsHTML[selected];
  
  if (selected === 'AV-9842') {
    restoreActiveSessionCharts();
  } else {
    renderHistoricalChart(selected);
  }
  
  chatHistory.scrollTop = chatHistory.scrollHeight;
  addAuditLog('info', 'Client', `Loaded session log: ${selected}`);
}
    
    // Bind Edify sub-tabs
    if (subTabNetworkBtn) subTabNetworkBtn.addEventListener('click', () => switchArchSubTab('network'));
    if (subTabEdifyBtn) subTabEdifyBtn.addEventListener('click', () => switchArchSubTab('edify'));

    // Bind session selector
    if (sessionSelector) {
      sessionSelector.addEventListener('change', (e) => {
        switchSession(e.target.value);
      });
    }

    // Bind hover events on nodes
    if (edifyFlowchartWrapper) {
      const edifyNodes = edifyFlowchartWrapper.querySelectorAll('.edify-node');
      edifyNodes.forEach(nodeEl => {
        const nodeType = nodeEl.getAttribute('data-node');
        
        nodeEl.addEventListener('mouseenter', () => {
          updateEdifyDetailsCard(nodeType);
          if (edifyIntervalId) clearInterval(edifyIntervalId);
        });
        
        nodeEl.addEventListener('mouseleave', () => {
          initEdifyJourneySimulation();
        });
      });
    }

    resizeCanvas();
    
    // ----------------------------------------------------
    // Interactive Demo Walkthrough Guide Logic
    // ----------------------------------------------------
    const guideWidget = document.getElementById('demo-guide-widget');
    const guideHeader = document.getElementById('demo-guide-header');
    const guideBody = document.getElementById('demo-guide-body');
    const toggleBtn = document.getElementById('guide-toggle-btn');
    
    const step1Col = document.getElementById('guide-step-col-1');
    const step2Col = document.getElementById('guide-step-col-2');
    const step3Col = document.getElementById('guide-step-col-3');
    
    const btnStep1 = document.getElementById('guide-btn-step1');
    const btnStep2 = document.getElementById('guide-btn-step2');
    const btnStep3 = document.getElementById('guide-btn-step3');
    
    const toggleMinimize = () => {
      if (guideWidget) {
        guideWidget.classList.toggle('minimized');
        if (toggleBtn) {
          toggleBtn.innerText = guideWidget.classList.contains('minimized') ? 'Expand' : 'Minimize';
        }
      }
    };
    
    if (guideHeader) {
      guideHeader.addEventListener('click', (e) => {
        if (e.target !== toggleBtn) {
          toggleMinimize();
        }
      });
    }
    if (toggleBtn) toggleBtn.addEventListener('click', toggleMinimize);
    
    // Collapsible Presets Widget Logic
    const scenariosWidget = document.getElementById('scenarios-widget');
    const scenariosHeader = document.getElementById('scenarios-header');
    const scenariosToggleBtn = document.getElementById('scenarios-toggle-btn');
    
    const togglePresets = () => {
      if (scenariosWidget) {
        scenariosWidget.classList.toggle('minimized');
        if (scenariosToggleBtn) {
          scenariosToggleBtn.innerText = scenariosWidget.classList.contains('minimized') ? 'Expand' : 'Minimize';
        }
      }
    };
    
    if (scenariosHeader) {
      scenariosHeader.addEventListener('click', (e) => {
        if (e.target !== scenariosToggleBtn) {
          togglePresets();
        }
      });
    }
    if (scenariosToggleBtn) scenariosToggleBtn.addEventListener('click', togglePresets);
    
    if (btnStep1) {
      btnStep1.addEventListener('click', () => {
        if (settingsModal) settingsModal.classList.add('active');
        
        setTimeout(() => {
          if (govToggleHipaa) govToggleHipaa.checked = true;
          
          setTimeout(() => {
            if (settingsSaveBtn) settingsSaveBtn.click();
            
            if (step1Col) {
              step1Col.classList.remove('active');
              step1Col.classList.add('completed');
            }
            btnStep1.innerText = '✓ Masked';
            btnStep1.disabled = true;
            
            if (step2Col) step2Col.classList.add('active');
            if (btnStep2) btnStep2.disabled = false;
            
            addAuditLog('info', 'Demo Guide', 'PII HIPAA Data Masking auto-enabled by tutorial guide.');
          }, 1000);
        }, 800);
      });
    }
    
    if (btnStep2) {
      btnStep2.addEventListener('click', () => {
        if (chatInputField) chatInputField.value = "Jeff Edwards is complaining about voice jitter, check his ticket and search policies for troubleshooting rules.";
        if (chatSendBtn) chatSendBtn.click();
        
        if (step2Col) {
          step2Col.classList.remove('active');
          step2Col.classList.add('completed');
        }
        btnStep2.innerText = '✓ Submitted';
        btnStep2.disabled = true;
        
        if (step3Col) step3Col.classList.add('active');
        if (btnStep3) btnStep3.disabled = false;
        
        addAuditLog('info', 'Demo Guide', 'Prompt submitted. Trace switches to Live Protocol Trace.');
      });
    }
    
    if (btnStep3) {
      btnStep3.addEventListener('click', () => {
        // 1. Switch to audit tab immediately
        switchTab('audit');
        
        // 2. Start the evaluation animation right in front of the user
        animateGuardrailsLoading();
        addAuditLog('info', 'Databricks', 'Initiating live hallucination and safety evaluation scans...');
        
        // 3. Highlight the audit elements
        if (auditLogBox) {
          auditLogBox.style.outline = '2px solid var(--color-cyan)';
          auditLogBox.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.4)';
          setTimeout(() => {
            auditLogBox.style.outline = 'none';
            auditLogBox.style.boxShadow = 'none';
          }, 3000);
        }
        
        // 4. Complete the animation after 1.5 seconds so they see it shift
        setTimeout(() => {
          animateGuardrailsComplete();
          addAuditLog('success', 'Databricks', 'LLM trust validations completed. Hallucination risk: Low (<1%). Groundedness: 98.6%.');
          
          if (step3Col) {
            step3Col.classList.remove('active');
            step3Col.classList.add('completed');
          }
          btnStep3.innerText = '✓ Done';
          btnStep3.disabled = true;
          
          setTimeout(() => {
            addAuditLog('success', 'Demo Guide', 'Interactive Walkthrough Completed successfully! All security validations passed.');
            
            const resetBtn = document.createElement('button');
            resetBtn.className = 'guide-action-btn';
            resetBtn.style.marginTop = '10px';
            resetBtn.innerText = 'Reset Demo Guide';
            resetBtn.addEventListener('click', () => {
              if (step1Col) step1Col.className = 'guide-step-col active';
              if (step2Col) step2Col.className = 'guide-step-col';
              if (step3Col) step3Col.className = 'guide-step-col';
              
              btnStep1.innerText = 'Enable Masking';
              btnStep1.disabled = false;
              
              btnStep2.innerText = 'Run Query';
              btnStep2.disabled = true;
              
              btnStep3.innerText = 'Inspect Audit';
              btnStep3.disabled = true;
              
              if (govToggleHipaa) govToggleHipaa.checked = false;
              if (settingsSaveBtn) settingsSaveBtn.click();
              
              resetBtn.remove();
            });
            if (guideBody) guideBody.appendChild(resetBtn);
          }, 500);
        }, 1500);
      });
    }
    
    resizeCanvas();
    
    // Update diagnostic indicator on successful setup
    const diag = document.getElementById('diagnostic-log');
    if (diag) {
      diag.style.color = '#10b981';
      diag.style.borderColor = '#10b981';
      diag.style.boxShadow = '0 0 15px rgba(16,185,129,0.2)';
      diag.innerText = 'Diagnostic Status: app.js LOADED successfully';
      
      // Wait 3 seconds, then transition opacity and translation to fade away beautifully
      setTimeout(() => {
        diag.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        diag.style.opacity = '0';
        diag.style.transform = 'translateY(15px)';
        // Hide completely after fade-out transition completes
        setTimeout(() => {
          diag.style.display = 'none';
        }, 1500);
      }, 3000);
    }
  } catch (err) {
    alert("Avaya MCP Demo Initialization Error:\n" + err.message + "\n\nStack:\n" + err.stack);
    console.error("Initialization Error:", err);
  }
};
