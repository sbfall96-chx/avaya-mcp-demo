import collections
import collections.abc
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

# =========================================================================
# PART 1: POWERPOINT GENERATOR (python-pptx)
# =========================================================================
def generate_pptx():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Theme Colors
    DARK_NAVY = RGBColor(10, 14, 23)
    LIGHT_GRAY = RGBColor(243, 244, 246)
    TEXT_MUTED = RGBColor(156, 163, 175)
    AVAYA_RED = RGBColor(218, 41, 28)
    CYAN_GLOW = RGBColor(0, 240, 255)
    GREEN_ROI = RGBColor(16, 185, 129)
    YELLOW_WARN = RGBColor(245, 158, 11)

    def apply_background(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_slide_header(slide, title, subtitle=None):
        txBox = slide.shapes.add_textbox(Inches(0.75), Inches(0.4), Inches(11.8), Inches(1.2))
        tf = txBox.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(28)
        p.font.color.rgb = LIGHT_GRAY
        p.font.name = "Outfit"
        
        if subtitle:
            p2 = tf.add_paragraph()
            p2.text = subtitle
            p2.font.size = Pt(14)
            p2.font.color.rgb = CYAN_GLOW
            p2.font.name = "Outfit"
            p2.space_before = Pt(4)

    # Slide 1: Title
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    apply_background(slide, DARK_NAVY)
    
    txBox = slide.shapes.add_textbox(Inches(1), Inches(2.0), Inches(11.333), Inches(4))
    tf = txBox.text_frame
    tf.word_wrap = True

    p1 = tf.paragraphs[0]
    p1.text = "AVAYA INFINITY"
    p1.font.bold = True
    p1.font.size = Pt(54)
    p1.font.color.rgb = AVAYA_RED
    p1.font.name = "Outfit"

    p2 = tf.add_paragraph()
    p2.text = "Zero-Trust AI Connection Orchestration & TCO Optimization"
    p2.font.size = Pt(24)
    p2.font.color.rgb = LIGHT_GRAY
    p2.font.name = "Outfit"
    p2.space_before = Pt(8)

    p3 = tf.add_paragraph()
    p3.text = "Sales Leadership & Solution Architect Pitch Deck\nStandardizing Enterprise AI Bus (MCP) & Databricks Governance"
    p3.font.size = Pt(14)
    p3.font.color.rgb = TEXT_MUTED
    p3.font.name = "Outfit"
    p3.space_before = Pt(35)

    # Slide 2: Legacy Challenge
    slide2 = prs.slides.add_slide(prs.slide_layouts[6])
    apply_background(slide2, DARK_NAVY)
    add_slide_header(slide2, "The Legacy Challenge: Spaghetti Integrations", "Direct Connections Scale Badly (N x M Custom Connector Mess)")
    
    # Left Box: Tech Spaghetti
    leftBox = slide2.shapes.add_textbox(Inches(0.75), Inches(1.8), Inches(5.5), Inches(4.8))
    tf_l = leftBox.text_frame
    tf_l.word_wrap = True
    
    p = tf_l.paragraphs[0]
    p.text = "Direct Point-to-Point Pipeline Pain"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = LIGHT_GRAY
    p.font.name = "Outfit"
    
    bullets = [
      "Custom Glue Code: Every database requires bespoke API adapters and custom schemas parsed separately for each model type.",
      "Hardcoded Credentials: Static tokens and credentials scattered across individual servers, raising security vulnerabilities.",
      "Audit Nightmare: Security teams must verify role permissions at every endpoint separately, slowing compliance times.",
      "Friction-heavy Updates: Changing database schema triggers cascading code rewrites across the entire pipeline."
    ]
    for b in bullets:
        bp = tf_l.add_paragraph()
        bp.text = "• " + b
        bp.font.size = Pt(13)
        bp.font.color.rgb = TEXT_MUTED
        bp.font.name = "Outfit"
        bp.space_before = Pt(10)
        bp.space_after = Pt(2)

    # Right Box: Business outcome
    rightBox = slide2.shapes.add_textbox(Inches(7.0), Inches(1.8), Inches(5.5), Inches(4.8))
    tf_r = rightBox.text_frame
    tf_r.word_wrap = True
    
    p = tf_r.paragraphs[0]
    p.text = "Business Outcomes & Cost Drivers"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = AVAYA_RED
    p.font.name = "Outfit"
    
    metrics = [
      ("TCO Integration Overhead:", " ~ $150,000 / year in engineering maintenance.", YELLOW_WARN),
      ("Agility Deployment Speed:", " 4 Months per new enterprise data source.", YELLOW_WARN),
      ("Governance Policy Rating:", " High Risk. Redaction is ad-hoc, and LLMs read database schemas directly without strict RBAC gatekeeping.", YELLOW_WARN)
    ]
    for label, val, color in metrics:
        bp1 = tf_r.add_paragraph()
        bp1.text = label
        bp1.font.bold = True
        bp1.font.size = Pt(14)
        bp1.font.color.rgb = color
        bp1.font.name = "Outfit"
        bp1.space_before = Pt(14)
        
        bp2 = tf_r.add_paragraph()
        bp2.text = val
        bp2.font.size = Pt(13)
        bp2.font.color.rgb = TEXT_MUTED
        bp2.font.name = "Outfit"

    # Slide 3: The Avaya Solution
    slide3 = prs.slides.add_slide(prs.slide_layouts[6])
    apply_background(slide3, DARK_NAVY)
    add_slide_header(slide3, "The Solution: Avaya Infinity MCP Bus", "Unified Connection Gateway (N + M Plug-and-Play Standardization)")
    
    # Left Box
    leftBox3 = slide3.shapes.add_textbox(Inches(0.75), Inches(1.8), Inches(5.5), Inches(4.8))
    tf_l3 = leftBox3.text_frame
    tf_l3.word_wrap = True
    
    p = tf_l3.paragraphs[0]
    p.text = "Universal Connection Standards"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = LIGHT_GRAY
    p.font.name = "Outfit"
    
    bullets = [
      "The 'USB-C for AI': Standardized Model Context Protocol client-server architecture eliminates point-to-point custom wrappers.",
      "Dynamic Discovery: Secure MCP Gateway automatically queries registered silos (Postgres, CRM, SharePoint) to expose resources, tools, and prompt structures on-the-fly.",
      "Separation of Concerns: Data repositories declare query scopes; LLMs consume clean APIs without direct table credentials.",
      "Multi-Brain Swap: Swap underlying AI brains (Gemini, Claude, GPT) instantly without refactoring data layer connectors."
    ]
    for b in bullets:
        bp = tf_l3.add_paragraph()
        bp.text = "• " + b
        bp.font.size = Pt(13)
        bp.font.color.rgb = TEXT_MUTED
        bp.font.name = "Outfit"
        bp.space_before = Pt(10)

    # Right Box
    rightBox3 = slide3.shapes.add_textbox(Inches(7.0), Inches(1.8), Inches(5.5), Inches(4.8))
    tf_r3 = rightBox3.text_frame
    tf_r3.word_wrap = True
    
    p = tf_r3.paragraphs[0]
    p.text = "Unified Sales Outcome Benefits"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = GREEN_ROI
    p.font.name = "Outfit"
    
    metrics = [
      ("TCO Integration Cost:", " $15,000 / year (90% savings over custom code).", GREEN_ROI),
      ("Agility Deployment Speed:", " 2 Hours. Fast plug-and-play capability to connect database nodes.", GREEN_ROI),
      ("Governance Policy Rating:", " Secure & Compliant. Low threat footprint; centralized RBAC policies protect underlying data layers.", GREEN_ROI)
    ]
    for label, val, color in metrics:
        bp1 = tf_r3.add_paragraph()
        bp1.text = label
        bp1.font.bold = True
        bp1.font.size = Pt(14)
        bp1.font.color.rgb = color
        bp1.font.name = "Outfit"
        bp1.space_before = Pt(14)
        
        bp2 = tf_r3.add_paragraph()
        bp2.text = val
        bp2.font.size = Pt(13)
        bp2.font.color.rgb = TEXT_MUTED
        bp2.font.name = "Outfit"

    # Slide 4: Databricks Governance
    slide4 = prs.slides.add_slide(prs.slide_layouts[6])
    apply_background(slide4, DARK_NAVY)
    add_slide_header(slide4, "Zero-Trust Governance: Databricks Unity Catalog", "Centralized Access Guardrails, Privacy Controls, and Audits")
    
    # Left Box
    leftBox4 = slide4.shapes.add_textbox(Inches(0.75), Inches(1.8), Inches(5.5), Inches(4.8))
    tf_l4 = leftBox4.text_frame
    tf_l4.word_wrap = True
    
    p = tf_l4.paragraphs[0]
    p.text = "Centralized Compliance Enforcements"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = LIGHT_GRAY
    p.font.name = "Outfit"
    
    bullets = [
      "PII HIPAA Redaction: Central parser intercepts prompts and results to mask patient/customer names (e.g. Jeff Edwards -> J*** E******).",
      "Restricted DB Access (RBAC): Automatically blocks raw tool calls to protected tables with a 403 authorization error.",
      "Live Audit Trail: Every LLM query, database invocation, and security exception is logged instantly to Databricks Audit tables.",
      "Zero-Copy Architecture: Models query databases in-place; no separate copies of client contact history stored on external disks."
    ]
    for b in bullets:
        bp = tf_l4.add_paragraph()
        bp.text = "• " + b
        bp.font.size = Pt(13)
        bp.font.color.rgb = TEXT_MUTED
        bp.font.name = "Outfit"
        bp.space_before = Pt(10)

    # Right Box
    rightBox4 = slide4.shapes.add_textbox(Inches(7.0), Inches(1.8), Inches(5.5), Inches(4.8))
    tf_r4 = rightBox4.text_frame
    tf_r4.word_wrap = True
    
    p = tf_r4.paragraphs[0]
    p.text = "Compliance Metrics Dashboard"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = CYAN_GLOW
    p.font.name = "Outfit"
    
    dashboard_bullets = [
      "PII Masked Count: Baseline 24 names auto-redacted in active simulation runs.",
      "Blocks Enforced: Real-time prevention of access violations (preventing data leaks in tool execution).",
      "SLA Health Status: 100% compliance SLA verified by Databricks logging dashboard.",
      "Audit Coverage: 100% of data pipeline logs monitored and archived for HIPAA/GDPR reviews."
    ]
    for db in dashboard_bullets:
        bp = tf_r4.add_paragraph()
        bp.text = "✔ " + db
        bp.font.size = Pt(13)
        bp.font.color.rgb = LIGHT_GRAY
        bp.font.name = "Outfit"
        bp.space_before = Pt(12)

    # Slide 5: Real-World Scenarios
    slide5 = prs.slides.add_slide(prs.slide_layouts[6])
    apply_background(slide5, DARK_NAVY)
    add_slide_header(slide5, "Real-World Scenarios & Business ROI Outcomes", "Quantifying Financial Value in Contact Center Operations")
    
    # 3-Column Grid
    width = Inches(3.6)
    height = Inches(4.8)
    y_pos = Inches(1.8)
    
    # Column 1
    c1 = slide5.shapes.add_textbox(Inches(0.75), y_pos, width, height)
    tf1 = c1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "1. Queue Recovery Spike"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = CYAN_GLOW
    p.font.name = "Outfit"
    
    c1_txt = [
      "Scenario: Mandatory team training triggers sudden queue wait time spikes.",
      "AI Resolution: Aura AI scans agent timetables, blocks concurrent breaks, and diverts incoming chats to self-service lanes.",
      "Business Outcome:",
      "Restored wait time from 185s to 15s. Prevented $3,200/day in SLA compliance fines."
    ]
    for t in c1_txt:
        bp = tf1.add_paragraph()
        bp.text = t
        if "Business Outcome:" in t:
            bp.font.bold = True
            bp.font.color.rgb = GREEN_ROI
        else:
            bp.font.color.rgb = TEXT_MUTED
        bp.font.size = Pt(11.5)
        bp.font.name = "Outfit"
        bp.space_before = Pt(6)

    # Column 2
    c2 = slide5.shapes.add_textbox(Inches(4.8), y_pos, width, height)
    tf2 = c2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "2. VIP Priority Routing"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = CYAN_GLOW
    p.font.name = "Outfit"
    
    c2_txt = [
      "Scenario: SIP trunk voice jitter spikes for active enterprise accounts.",
      "AI Resolution: Tandem Care triggers L3 priority escalation checkpoint requiring supervisor approval.",
      "Business Outcome:",
      "Rerouted VIP calls in 10s. Retained $24,000 in VIP account contract ARR and secured 100% CSAT."
    ]
    for t in c2_txt:
        bp = tf2.add_paragraph()
        bp.text = t
        if "Business Outcome:" in t:
            bp.font.bold = True
            bp.font.color.rgb = GREEN_ROI
        else:
            bp.font.color.rgb = TEXT_MUTED
        bp.font.size = Pt(11.5)
        bp.font.name = "Outfit"
        bp.space_before = Pt(6)

    # Column 3
    c3 = slide5.shapes.add_textbox(Inches(8.85), y_pos, width, height)
    tf3 = c3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "3. Churn Prevention ROI"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = CYAN_GLOW
    p.font.name = "Outfit"
    
    c3_txt = [
      "Scenario: Customer threatens cancellation due to pricing issues.",
      "AI Resolution: Queries SharePoint KB policies, calculates maximum authorized credit structure, logs coupon trace.",
      "Business Outcome:",
      "Authorized $1,260 retention credit, saving $8,400 contract value. Achieved 6.6x ROI on CAC."
    ]
    for t in c3_txt:
        bp = tf3.add_paragraph()
        bp.text = t
        if "Business Outcome:" in t:
            bp.font.bold = True
            bp.font.color.rgb = GREEN_ROI
        else:
            bp.font.color.rgb = TEXT_MUTED
        bp.font.size = Pt(11.5)
        bp.font.name = "Outfit"
        bp.space_before = Pt(6)

    # Save
    prs.save("Avaya_Infinity_MCP_Pitch_Deck.pptx")
    print("PowerPoint deck generated: Avaya_Infinity_MCP_Pitch_Deck.pptx")

# =========================================================================
# PART 2: PDF BRIEF GENERATOR (ReportLab)
# =========================================================================
def generate_pdf():
    pdf_filename = "Avaya_Infinity_MCP_Executive_Brief.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#DA291C'),
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#6b7280'),
        spaceAfter=15
    )
    
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#111827'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#374151'),
        spaceAfter=8
    )
    
    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#374151'),
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )
    
    bold_body_style = ParagraphStyle(
        'DocBoldBody',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    story = []
    
    # ----------------- TITLE PAGE / SECTION 1 -----------------
    story.append(Paragraph("AVAYA INFINITY MCP SOLUTIONS BRIEF", title_style))
    story.append(Paragraph("Standardizing AI Connections & Centralizing Databricks Governance", subtitle_style))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("1. Executive Summary", h2_style))
    story.append(Paragraph(
        "Avaya Infinity's Model Context Protocol (MCP) framework shifts enterprise communication systems "
        "from traditional static point-to-point connections to dynamic AI-driven connection orchestration. "
        "Historically, custom pipelines required massive coding efforts to connect models directly to backend databases, "
        "inflating maintenance budgets and raising security exposure concerns. By introducing a centralized MCP gateway, "
        "Avaya enables unified data discovery, real-time query parsing, and seamless multi-AI model support, "
        "reducing implementation costs by up to 90% and integration times from months to hours.",
        body_style
    ))
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("2. Financial Comparison & TCO Metrics", h2_style))
    story.append(Paragraph(
        "For sales leadership (Carlos) and sales engineers (SEs), the value proposition is represented by "
        "the reduction in connection complexity from an N x M custom mess to a standard N + M open bus:",
        body_style
    ))
    
    # TCO Table
    table_data = [
        [Paragraph("Metric", bold_body_style), 
         Paragraph("Legacy Spaghetti Architecture", bold_body_style), 
         Paragraph("Avaya Infinity MCP Bus", bold_body_style)],
        [Paragraph("Annual TCO", body_style), Paragraph("$150,000 / year (Custom code maintenance)", body_style), Paragraph("$15,000 / year (90% savings)", body_style)],
        [Paragraph("Deployment Agility", body_style), Paragraph("4 Months per connector", body_style), Paragraph("2 Hours plug-and-play", body_style)],
        [Paragraph("Security/Compliance", body_style), Paragraph("High Risk (Static files, exposed credentials)", body_style), Paragraph("Protected (Zero-Trust isolation)", body_style)],
        [Paragraph("Integration Logic", body_style), Paragraph("N x M point-to-point scripting", body_style), Paragraph("N + M unified schema gateway", body_style)]
    ]
    
    t = Table(table_data, colWidths=[1.5*inch, 2.5*inch, 2.5*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f3f4f6')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#d1d5db')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 15))
    
    # ----------------- SECTION 3 -----------------
    story.append(Paragraph("3. Databricks Unity Catalog Enterprise Governance", h2_style))
    story.append(Paragraph(
        "Avaya Infinity wraps all database queries through Databricks Unity Catalog to enforce zero-trust security:",
        body_style
    ))
    story.append(Paragraph("• <b>Dynamic HIPAA Redaction:</b> Customer profiles are automatically masked inside tool arguments, database inserts, and chat responses. Customer names are replaced with formatted redacted masks.", bullet_style))
    story.append(Paragraph("• <b>Role-Based Access Control (RBAC):</b> If unauthorized database calls are attempted (e.g. settings restricted), the query fails immediately with a secure 403 Exception.", bullet_style))
    story.append(Paragraph("• <b>Unified Compliance Audit Logging:</b> Access blocks, credential updates, and masking triggers are dynamically pushed into centralized audit logs.", bullet_style))
    
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("4. Simulated Scenarios & Business Outcomes", h2_style))
    
    scenarios_data = [
        [Paragraph("Scenario", bold_body_style), Paragraph("AI Action", bold_body_style), Paragraph("Business Outcome", bold_body_style)],
        [
            Paragraph("<b>Queue Recovery Spike</b>", body_style), 
            Paragraph("Identifies break schedules, blocks concurrent webinar meetings, redirects chat traffic.", body_style), 
            Paragraph("Wait time cut from 185s to 15s. Prevented <b>$3,200/day</b> in SLA penalties.", body_style)
        ],
        [
            Paragraph("<b>VIP Priority Routing</b>", body_style), 
            Paragraph("Triggers voice trunk jitter troubleshooting and Tandem Care supervisor escalation checkpoints.", body_style), 
            Paragraph("Escalated to L3 in 10s. Retained <b>$24,000 VIP contract ARR</b>; 100% CSAT.", body_style)
        ],
        [
            Paragraph("<b>Retention Discount ROI</b>", body_style), 
            Paragraph("Searches SharePoint contract policy, computes retention discount guidelines, files records.", body_style), 
            Paragraph("Applied $1,260 credit, saving <b>$8,400 contract value</b> (6.6x ROI relative to CAC).", body_style)
        ]
    ]
    
    t2 = Table(scenarios_data, colWidths=[1.5*inch, 2.5*inch, 2.5*inch])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f3f4f6')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#d1d5db')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t2)
    
    doc.build(story)
    print("Executive Brief PDF generated: Avaya_Infinity_MCP_Executive_Brief.pdf")

if __name__ == "__main__":
    generate_pptx()
    generate_pdf()
