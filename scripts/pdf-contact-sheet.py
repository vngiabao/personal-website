from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
folder=Path('v2/qa/ledger/pdf-review')
files=list(folder.glob('*.png'))
canvas=Image.new('RGB',(1500,((len(files)+2)//3)*330),'#e3ddd2');d=ImageDraw.Draw(canvas)
for i,f in enumerate(files):
 im=Image.open(f);im.thumbnail((480,285));x=(i%3)*500+10;y=(i//3)*330+30;canvas.paste(im,(x,y));d.text((x,y-20),f.name,fill='black')
canvas.save(folder/'contact-sheet.jpg')
