"""Applique le filigrane diagonal MEGASAVE MEDIAS sur chaque page du PDF."""
import io, sys
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

SRC, DST = sys.argv[1], sys.argv[2]

reader = PdfReader(SRC)
w = float(reader.pages[0].mediabox.width)
h = float(reader.pages[0].mediabox.height)

buf = io.BytesIO()
c = canvas.Canvas(buf, pagesize=(w, h))
c.saveState()
c.translate(w / 2, h / 2)
c.rotate(45)
c.setFont("Helvetica-Bold", 58)
c.setFillColor(HexColor("#D9D9D9"))
c.drawCentredString(0, -20, "MEGASAVE MEDIAS")
c.restoreState()
c.save()
buf.seek(0)

wm_page = PdfReader(buf).pages[0]

writer = PdfWriter()
for page in reader.pages:
    page.merge_page(wm_page, over=False)
    writer.add_page(page)

with open(DST, "wb") as f:
    writer.write(f)

print(f"Filigrane applique sur {len(reader.pages)} pages -> {DST}")
