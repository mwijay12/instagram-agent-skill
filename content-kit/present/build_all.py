#!/usr/bin/env python3
"""Build the company-facing deliverables from one source of truth.

Inputs
  content-kit/present/content.json        strategy sections
  content-kit/bio-variations.json        the 4 bio variations, contacts, domain
  content-kit/assets/fonts/*.ttf         real brand fonts

Outputs
  Altraware-Content-Strategy.pdf         branded A4 PDF (ReportLab)
  Altraware-Content-Strategy.doc.html    HTML -> converted to a Google Doc
  site/index.html                        self-contained phone-friendly site

Optional: links.json with {"pdf": "...", "doc": "..."} is injected into the
Doc HTML and the site so the three artifacts point at each other.

Run:  /tmp/kvenv/bin/python content-kit/present/build_all.py
"""
import html
import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, HRFlowable, KeepTogether,
                                NextPageTemplate, PageBreak, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle)

HERE = Path(__file__).resolve().parent
KIT = HERE.parent
FONTS = KIT / "assets" / "fonts"
CONTENT = json.loads((HERE / "content.json").read_text(encoding="utf-8"))
BIO = json.loads((KIT / "bio-variations.json").read_text(encoding="utf-8"))
LINKS = json.loads((HERE / "links.json").read_text(encoding="utf-8")) if (HERE / "links.json").exists() else {}

NAVY = colors.HexColor("#071022")
NAVY2 = colors.HexColor("#0a1735")
PAPER = colors.HexColor("#f7f6f2")
CARD = colors.HexColor("#efede5")
GOLD = colors.HexColor("#eab308")
VIOLET = colors.HexColor("#7c3aed")
MUTED = colors.HexColor("#a3aecb")
INK = colors.HexColor("#14203a")
WHITE = colors.white
RULE = colors.HexColor("#d8d6cd")

for key, fn in [("Fraunces", "fraunces-latin-opsz-normal.ttf"),
                ("FrauncesIt", "fraunces-latin-opsz-italic.ttf"),
                ("Inter", "inter-latin-wght-normal.ttf"),
                ("Mono", "jetbrains-mono-latin-wght-normal.ttf")]:
    pdfmetrics.registerFont(TTFont(key, str(FONTS / fn)))

S = {
    "kicker": ParagraphStyle("kicker", fontName="Mono", fontSize=8, leading=11,
                             textColor=GOLD, spaceAfter=4),
    "cover_title": ParagraphStyle("cover_title", fontName="Fraunces", fontSize=36,
                                  leading=40, textColor=WHITE, spaceAfter=2),
    "cover_italic": ParagraphStyle("cover_italic", fontName="FrauncesIt", fontSize=36,
                                   leading=40, textColor=GOLD, spaceAfter=18),
    "cover_sub": ParagraphStyle("cover_sub", fontName="Inter", fontSize=12,
                                leading=18, textColor=MUTED),
    "cover_meta": ParagraphStyle("cover_meta", fontName="Mono", fontSize=8.5,
                                 leading=14, textColor=MUTED),
    "h2": ParagraphStyle("h2", fontName="Fraunces", fontSize=21, leading=25,
                         textColor=NAVY, spaceBefore=2, spaceAfter=9),
    "body": ParagraphStyle("body", fontName="Inter", fontSize=9.4, leading=14,
                           textColor=INK, spaceAfter=7, alignment=TA_LEFT),
    "small": ParagraphStyle("small", fontName="Inter", fontSize=8.3, leading=12,
                            textColor=INK, spaceAfter=3),
    "cell": ParagraphStyle("cell", fontName="Inter", fontSize=8.2, leading=11.2,
                           textColor=INK),
    "cellh": ParagraphStyle("cellh", fontName="Inter", fontSize=8.2, leading=11,
                            textColor=WHITE),
    "mono": ParagraphStyle("mono", fontName="Mono", fontSize=8, leading=12,
                           textColor=NAVY),
    "varlabel": ParagraphStyle("varlabel", fontName="Fraunces", fontSize=12.5,
                               leading=16, textColor=NAVY, spaceAfter=3),
}

W, H = A4
LM = RM = 46
AVAIL = W - LM - RM


def esc(t):
    return html.escape(str(t), quote=False).replace("\n", "<br/>")


def P(t, style="body"):
    return Paragraph(esc(t), S[style])


def rules(n=2):
    return [Spacer(1, 3), HRFlowable(width="100%", thickness=0.8, color=GOLD,
                                    spaceBefore=0, spaceAfter=9)]


def table_block(b):
    head, rows = b["head"], b["rows"]
    n = len(head)
    widths = {2: [150, AVAIL - 150], 3: [72, 168, AVAIL - 240]}.get(n)
    if not widths:
        widths = [AVAIL / n] * n
    data = [[Paragraph(esc(c), S["cellh"]) for c in head]]
    for r in rows:
        data.append([Paragraph(esc(c), S["cell"]) for c in r])
    t = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    st = [("BACKGROUND", (0, 0), (-1, 0), NAVY),
          ("VALIGN", (0, 0), (-1, -1), "TOP"),
          ("LEFTPADDING", (0, 0), (-1, -1), 7),
          ("RIGHTPADDING", (0, 0), (-1, -1), 7),
          ("TOPPADDING", (0, 0), (-1, -1), 6),
          ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
          ("LINEBELOW", (0, 0), (-1, -1), 0.35, RULE),
          ("BOX", (0, 0), (-1, -1), 0.5, RULE)]
    for i in range(1, len(data)):
        if i % 2 == 0:
            st.append(("BACKGROUND", (0, i), (-1, i), CARD))
    t.setStyle(TableStyle(st))
    return [t, Spacer(1, 9)]


def bullets_block(b):
    out = []
    for it in b["items"]:
        out.append(Paragraph('<font color="#eab308">&#9642;</font>&nbsp;&nbsp;' + esc(it),
                             ParagraphStyle("b", parent=S["body"], leftIndent=12,
                                            firstLineIndent=-12, spaceAfter=5)))
    out.append(Spacer(1, 5))
    return out


def callout_block(b):
    inner = Paragraph('<font name="Inter" color="#eab308" size="8"><b>' +
                      esc(b["label"]).upper() + '</b></font><br/>' + esc(b["text"]),
                      ParagraphStyle("co", parent=S["body"], fontSize=9, leading=13))
    t = Table([[inner]], colWidths=[AVAIL], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fdf6dd")),
        ("LINEBEFORE", (0, 0), (0, 0), 3, GOLD),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#e6d38a")),
        ("LEFTPADDING", (0, 0), (-1, -1), 11),
        ("RIGHTPADDING", (0, 0), (-1, -1), 11),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return [t, Spacer(1, 10)]


def variation_block():
    out = []
    for i, v in enumerate(BIO["variations"], 1):
        star = "  (INAYOSUGGEST)" if v.get("recommended") else ""
        lines = [
            f'<font name="Fraunces" size="12" color="#071022"><b>V{i} · {esc(v["label"])}</b></font>'
            f'<font name="Mono" size="7.5" color="#7c3aed">{star}</font>',
            f'<font name="Mono" size="8" color="#071022">NAME  {esc(v["name"])}</font>'
            f'<font name="Mono" size="7" color="#6b7488">  ({v["name_chars"]}/30)</font>',
            f'<font name="Inter" size="8.6" color="#14203a">{esc(v["bio"])}</font>',
            f'<font name="Inter" size="7.8" color="#5c6478">KWA NINI: {esc(v["why"])}</font>',
            f'<font name="Inter" size="7.8" color="#5c6478">GHARAMA: {esc(v["tradeoff"])}</font>',
        ]
        body = Paragraph("<br/>".join(lines), ParagraphStyle("v", fontName="Inter",
                                                            fontSize=8.5, leading=13))
        t = Table([[body]], colWidths=[AVAIL], hAlign="LEFT")
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), CARD if i % 2 else PAPER),
            ("LINEBEFORE", (0, 0), (0, 0), 3, GOLD if v.get("recommended") else VIOLET),
            ("BOX", (0, 0), (-1, -1), 0.5, RULE),
            ("LEFTPADDING", (0, 0), (-1, -1), 11),
            ("RIGHTPADDING", (0, 0), (-1, -1), 11),
            ("TOPPADDING", (0, 0), (-1, -1), 9),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ]))
        out += [KeepTogether([t]), Spacer(1, 7)]
    out.append(Paragraph(
        '<font name="Mono" size="7.5" color="#6b7488">Chanzo: content-kit/bio-variations.json · '
        'default ya sasa ni V2 · mmiliki bado hajachagua</font>', S["small"]))
    return out


def contacts_block():
    c, d = BIO["contacts"], BIO["domain"]
    rows = [
        ["Email", c["email"], "Contact button (Email) kwenye profile"],
        ["WhatsApp BOT", c["whatsapp_bot"]["local"] + " / " + c["whatsapp_bot"]["intl"],
         c["whatsapp_bot"]["use"]],
        ["MTU halisi", c["human"]["intl"], c["human"]["use"]],
        ["Link", d["current"], d["status"]],
    ]
    return table_block({"head": ["Kitu", "Thamani", "Mahali / maana"], "rows": rows}) + [
        P("Bot si mtu: usiiweke kama Call button. Wao wanaanza, wewe unajibu - hakuna bulk DM.", "small"),
        Spacer(1, 6),
    ]


def captions_block():
    out = []
    for i, cap in enumerate(BIO["caption_examples"], 1):
        txt = (f'<font name="Mono" size="7.5" color="#7c3aed">CAPTION {i}</font><br/>'
               f'<font name="Inter" size="9" color="#071022"><b>{esc(cap["line1"])}</b></font><br/>'
               f'<font name="Inter" size="8.2" color="#14203a">{esc(cap["body"])}</font><br/>'
               f'<font name="Mono" size="8" color="#071022">{esc(cap["ask"])}</font>  '
               f'<font name="Mono" size="7.5" color="#6b7488">{esc(" ".join(cap["hashtags"]))}</font>')
        t = Table([[Paragraph(txt, S["cell"])]], colWidths=[AVAIL], hAlign="LEFT")
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), PAPER),
            ("LINEBEFORE", (0, 0), (0, 0), 3, VIOLET),
            ("BOX", (0, 0), (-1, -1), 0.5, RULE),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ]))
        out += [t, Spacer(1, 7)]
    return out


def render_block(b):
    t = b["type"]
    if t == "p":
        return [P(b["text"])]
    if t == "bullets":
        return bullets_block(b)
    if t == "table":
        return table_block(b)
    if t == "callout":
        return callout_block(b)
    if t == "variations":
        return variation_block()
    if t == "contacts":
        return contacts_block()
    if t == "captions":
        return captions_block()
    return []


# --------------------------------------------------------------------------
# PDF
# --------------------------------------------------------------------------
def draw_cover(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, W, H, stroke=0, fill=1)
    canvas.setLineWidth(0.55)
    for k in range(17):
        y = 70 + k * 62
        canvas.setStrokeColor(colors.Color(0.486, 0.227, 0.929, alpha=0.30))
        p = canvas.beginPath()
        p.moveTo(-40, y)
        for x in range(0, int(W) + 120, 120):
            p.curveTo(x + 30, y + 26, x + 90, y - 26, x + 120, y)
        canvas.drawPath(p, stroke=1, fill=0)
    canvas.setStrokeColor(colors.Color(0.918, 0.702, 0.031, alpha=0.75))
    canvas.setLineWidth(1)
    canvas.line(LM, H - 150, W - RM, H - 150)
    canvas.setFont("Mono", 8)
    canvas.setFillColor(GOLD)
    canvas.drawString(LM, H - 138, "ACT 01 / MIZIZI")
    canvas.drawRightString(W - RM, H - 138, "6.7924° S, 39.2083° E")
    canvas.setStrokeColor(colors.Color(0.64, 0.68, 0.80, alpha=0.35))
    canvas.line(LM, 96, W - RM, 96)
    canvas.setFont("Mono", 7.6)
    canvas.setFillColor(MUTED)
    canvas.drawString(LM, 80, "ALTRAWARE TECH  ·  17 NOV 2026  ·  DAR ES SALAAM")
    canvas.drawRightString(W - RM, 80, "TOLEO LA KAZI v1")
    canvas.restoreState()


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, W, H, stroke=0, fill=1)
    canvas.setFillColor(NAVY)
    canvas.rect(0, H - 34, W, 34, stroke=0, fill=1)
    canvas.setFont("Mono", 7.6)
    canvas.setFillColor(GOLD)
    canvas.drawString(LM, H - 22, "ALTRAWARE TECH / CONTENT STRATEGY")
    canvas.setFillColor(MUTED)
    canvas.drawRightString(W - RM, H - 22, f"UK. {doc.page - 1:02d}")
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.6)
    canvas.line(LM, 46, W - RM, 46)
    canvas.setFont("Mono", 7.2)
    canvas.setFillColor(colors.HexColor("#7a8296"))
    canvas.drawString(LM, 33, "6.7924° S, 39.2083° E  ·  @altrawaretechnology")
    canvas.drawRightString(W - RM, 33, "HAKUNA KILOCHOPOSTWA")
    canvas.restoreState()


def build_pdf():
    out = HERE / "Altraware-Content-Strategy.pdf"
    doc = BaseDocTemplate(str(out), pagesize=A4,
                          leftMargin=LM, rightMargin=RM, topMargin=52, bottomMargin=58,
                          title="Altraware Tech - Mkakati wa Maudhui Instagram",
                          author="Altraware Tech", subject="Content strategy & IG setup")
    frame = Frame(LM, 58, AVAIL, H - 52 - 58, id="body", leftPadding=0,
                  rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[frame], onPage=draw_cover),
        PageTemplate(id="body", frames=[frame], onPage=draw_page),
    ])
    m = CONTENT["meta"]
    st = [
        Spacer(1, 58),
        P("ALTRAWARE TECH  /  17 NOVEMBA 2026", "kicker"),
        Spacer(1, 30),
        P(m["title"], "cover_title"),
        P(m["subtitle"], "cover_italic"),
        P("Mkakati wa maudhui, bio, settings za utafutaji, usalama na mfumo wa kazi "
          "kwa akaunti mbili za Instagram - umejengwa kutoka kwenye repo zako halisi, "
          "si kutoka kwenye template.", "cover_sub"),
        Spacer(1, 26),
        P("Brand: " + m["company"], "cover_meta"),
        P("Akaunti: " + m["accounts"], "cover_meta"),
        P("Mahali: " + m["place"], "cover_meta"),
        P("Toleo: " + m["edition"], "cover_meta"),
        Spacer(1, 20),
        P("Hali: " + m["status"], "cover_meta"),
        Spacer(1, 14),
        P("Vyanzo vya ukweli: content-kit/present/content.json · "
          "content-kit/bio-variations.json", "cover_meta"),
        NextPageTemplate("body"),
        PageBreak(),
    ]
    secs = CONTENT["sections"]
    for i, sec in enumerate(secs):
        st += [P(sec["kicker"], "kicker"), P(sec["title"], "h2")]
        st += rules()
        for b in sec["blocks"]:
            st += render_block(b)
        if i != len(secs) - 1:
            st.append(PageBreak())
    doc.build(st)
    print("PDF ", out.name, f"({out.stat().st_size // 1024} KB)")


# --------------------------------------------------------------------------
# HTML (Google Doc conversion) + self-contained site
# --------------------------------------------------------------------------
def html_table(b):
    th = "".join(f"<th>{html.escape(str(c))}</th>" for c in b["head"])
    tr = "".join("<tr>" + "".join(f"<td>{html.escape(str(c))}</td>" for c in r) + "</tr>"
                 for r in b["rows"])
    return f"<table><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table>"


def html_variations():
    out = []
    for i, v in enumerate(BIO["variations"], 1):
        out.append(f"<h3>V{i} · {html.escape(v['label'])}"
                   + (" (inayosuggest)" if v.get("recommended") else "") + "</h3>")
        out.append(f"<p><b>Name field ({v['name_chars']}/30):</b><br/><code>{html.escape(v['name'])}</code></p>")
        out.append(f"<p><b>Bio ({v['bio_chars']}/150):</b><br/>"
                   + html.escape(v["bio"]).replace("\n", "<br/>") + "</p>")
        out.append(f"<p><b>Kwa nini:</b> {html.escape(v['why'])}<br/>"
                   f"<b>Gharama:</b> {html.escape(v['tradeoff'])}</p>")
    return "\n".join(out)


def html_contacts():
    c, d = BIO["contacts"], BIO["domain"]
    return ("<table><thead><tr><th>Kitu</th><th>Thamani</th><th>Mahali / maana</th></tr></thead><tbody>"
            f"<tr><td>Email</td><td>{html.escape(c['email'])}</td><td>Contact button (Email)</td></tr>"
            f"<tr><td>WhatsApp BOT</td><td>{html.escape(c['whatsapp_bot']['local'])} / {html.escape(c['whatsapp_bot']['intl'])}</td>"
            f"<td>{html.escape(c['whatsapp_bot']['use'])}</td></tr>"
            f"<tr><td>MTU halisi</td><td>{html.escape(c['human']['intl'])}</td><td>{html.escape(c['human']['use'])}</td></tr>"
            f"<tr><td>Link</td><td>{html.escape(d['current'])}</td><td>{html.escape(d['status'])}</td></tr>"
            "</tbody></table>")


def html_captions():
    out = []
    for i, cap in enumerate(BIO["caption_examples"], 1):
        out.append(f"<h3>Caption {i}</h3><p><b>{html.escape(cap['line1'])}</b></p>"
                   f"<p>{html.escape(cap['body'])}</p>"
                   f"<p><code>{html.escape(cap['ask'])}</code> &nbsp; "
                   f"{html.escape(' '.join(cap['hashtags']))}</p>")
    return "\n".join(out)


def html_block(b):
    t = b["type"]
    if t == "p":
        return f"<p>{html.escape(b['text'])}</p>"
    if t == "bullets":
        return "<ul>" + "".join(f"<li>{html.escape(i)}</li>" for i in b["items"]) + "</ul>"
    if t == "table":
        return html_table(b)
    if t == "callout":
        return (f"<p><b>{html.escape(b['label']).upper()}:</b> "
                f"{html.escape(b['text'])}</p>")
    if t == "variations":
        return html_variations()
    if t == "contacts":
        return html_contacts()
    if t == "captions":
        return html_captions()
    return ""


def build_doc_html():
    m = CONTENT["meta"]
    parts = [f"<h1>{html.escape(m['company'])} - {html.escape(m['title'])}</h1>",
             f"<p><b>{html.escape(m['subtitle'])}</b> · {html.escape(m['edition'])}</p>",
             f"<p>{html.escape(m['place'])}<br/>Akaunti: {html.escape(m['accounts'])}</p>",
             f"<p><i>{html.escape(m['status'])}</i></p>"]
    if LINKS.get("pdf"):
        parts.append(f'<p>PDF yenye brand kamili: <a href="{html.escape(LINKS["pdf"])}">'
                     'Altraware-Content-Strategy.pdf</a></p>')
    if LINKS.get("site"):
        parts.append(f'<p>Tovuti ya simu: <a href="{html.escape(LINKS["site"])}">'
                     + html.escape(LINKS["site"]) + "</a></p>")
    if LINKS.get("preview"):
        parts.append(f'<p>Preview ya moja kwa moja (bila login): <a href="{html.escape(LINKS["preview"])}">'
                     + html.escape(LINKS["preview"]) + "</a></p>")
    for sec in CONTENT["sections"]:
        parts.append(f"<h2>{html.escape(sec['id'])} · {html.escape(sec['title'])}</h2>")
        parts.append(f"<p><i>{html.escape(sec['kicker'])}</i></p>")
        for b in sec["blocks"]:
            parts.append(html_block(b))
    parts.append("<p><i>Imetengenezwa kutoka content-kit/present/content.json na "
                 "content-kit/bio-variations.json. Hakuna kilichopostwa kwenye Instagram.</i></p>")
    body = "\n".join(parts)
    doc = ("<!doctype html><html><head><meta charset='utf-8'>"
           "<title>Altraware Tech - Content Strategy</title>"
           "<style>body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;line-height:1.5;"
           "color:#14203a}h1{font-family:Georgia,serif;font-size:24pt;color:#071022}"
           "h2{font-family:Georgia,serif;font-size:16pt;color:#071022;margin-top:22pt}"
           "h3{font-family:Georgia,serif;font-size:12pt;color:#7c3aed}"
           "table{border-collapse:collapse;width:100%;margin:8pt 0}"
           "th{background:#071022;color:#fff;text-align:left;padding:6pt}"
           "td{border-bottom:1px solid #ddd;padding:6pt;vertical-align:top}"
           "code{font-family:'Courier New',monospace;background:#f1efe8;padding:1pt 3pt}"
           "li{margin-bottom:3pt}</style></head><body>" + body + "</body></html>")
    out = HERE / "Altraware-Content-Strategy.doc.html"
    out.write_text(doc, encoding="utf-8")
    print("DOC ", out.name, f"({len(doc) // 1024} KB)")


def build_site():
    payload = {"meta": CONTENT["meta"], "sections": CONTENT["sections"],
               "bio": BIO, "links": LINKS}
    data_js = json.dumps(payload, ensure_ascii=False)
    tpl = (HERE / "site.template.html").read_text(encoding="utf-8")
    out = HERE / "site" / "index.html"
    out.write_text(tpl.replace("/*__DATA__*/", "window.STRATEGY = " + data_js + ";"),
                   encoding="utf-8")
    print("SITE", out.name, f"({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    build_pdf()
    build_doc_html()
    build_site()
