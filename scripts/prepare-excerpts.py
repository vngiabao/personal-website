from pathlib import Path
from io import BytesIO
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
import json
root=Path(__file__).resolve().parents[2]
jobs=[
 ('articulate-team-11.pdf','articulate-selected-excerpts.pdf','ARTiculate',[1,11,13,17,25],['Product concept / Ross +Tech Innovation Jam / 2025','Selected concept and team slides.','Competition recognition is not evidence of clinical effectiveness.','Private personal case material and appendix artwork are excluded.']),
 ('secc-2026-five-star-consulting.pdf','aurora-selected-excerpts.pdf','Aurora: U.S. market entry',[1,6,14,17],['Competition recommendation / SECC / 2026','A historical team recommendation, not a deployed client program.','Selected positioning and execution exhibits.','Financial model pages and unverified outcome projections are excluded.']),
 ('mhcc-2025-syntria-partners.pdf','cagrisema-selected-excerpts.pdf','CagriSema launch strategy',[1,10,14,16],['Historical competition analysis / MHCC / 2025','The retained artifact is labeled Quarter Finals Submission.','The team reached the semifinals.','No current drug-status or clinical-superiority claim is made here.','Personal health histories and model pages are excluded.']),
]
manifest=[]
for source,target,title,pages,notes in jobs:
 reader=PdfReader(root/'documents'/source); writer=PdfWriter(); buf=BytesIO()
 c=canvas.Canvas(buf,pagesize=(960,540));c.setFillColor(HexColor('#f5f0e6'));c.rect(0,0,960,540,fill=1,stroke=0)
 c.setFillColor(HexColor('#0b2d5c'));c.setFont('Helvetica',10);c.drawString(55,480,'BAO VO / SELECTED SOURCE MATERIAL')
 c.setFont('Times-Roman',42);c.drawString(55,395,title)
 c.setStrokeColor(HexColor('#997523'));c.line(55,360,905,360)
 c.setFont('Helvetica',13)
 for i,note in enumerate(notes):c.drawString(55,315-i*28,note)
 c.setFont('Helvetica',10);c.drawString(55,72,'Original source pages: '+', '.join(map(str,pages)))
 c.drawString(55,52,'Original sources preserved. Selected excerpts follow without alteration.')
 c.showPage();c.save();writer.add_page(PdfReader(buf).pages[0])
 for p in pages:writer.add_page(reader.pages[p-1])
 writer.add_metadata({'/Title':title+' - selected historical source excerpts','/Author':'Bao Vo and credited project team','/Subject':'Selected source material; see introductory evidence note'})
 output=root/'v2/public/documents'/target
 with output.open('wb') as f:writer.write(f)
 check=PdfReader(output);assert len(check.pages)==len(pages)+1
 manifest.append({'source':str(Path('documents')/source),'output':'/documents/'+target,'originalPages':pages,'pages':len(check.pages),'notes':notes})
(root/'v2/content/document-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
print('Created three qualified excerpts; original files unchanged.')
