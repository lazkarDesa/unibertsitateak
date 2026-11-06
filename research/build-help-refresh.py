from pathlib import Path
import json, math
from html import escape
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'output/help-review';OUT.mkdir(parents=True,exist_ok=True)
FONT=Path('C:/Windows/Fonts')
pdfmetrics.registerFont(TTFont('Guide',str(FONT/'arial.ttf')))
pdfmetrics.registerFont(TTFont('GuideBold',str(FONT/'arialbd.ttf')))
pdfmetrics.registerFontFamily('Guide',normal='Guide',bold='GuideBold',italic='Guide',boldItalic='GuideBold')
numberfont=ImageFont.truetype(str(FONT/'arialbd.ttf'),19)
INK='#143041';TEAL='#007b81';ORANGE='#b8460d'
warnings=[]

def annotated(data,lang,mode,f):
 raw=ROOT/'research/help-refresh'/lang/mode
 rects=json.loads((raw/(f['raw']+'.json')).read_text('utf8'))
 tiles_path=raw/(f['raw']+'.tiles.json')
 if tiles_path.exists():
  meta=json.loads(tiles_path.read_text('utf8'));tiles=[(entry,Image.open(raw/entry['file']).convert('RGB')) for entry in meta['tiles']]
  image=Image.new('RGB',(tiles[0][1].width,math.ceil(max(entry['y']+tile.height for entry,tile in tiles))),'#f5f8f9')
  if tiles[0][0]['y']>min(r['y'] for r in rects) or image.height<max(r['y']+r['h'] for r in rects):raise ValueError(f'Incomplete tiles {lang}/{mode}/{f["raw"]}')
  for entry,tile in tiles:image.paste(tile,(0,round(entry['y'])))
 else:image=Image.open(raw/(f['raw']+'.jpg')).convert('RGB')
 selected=[]
 for sel in f['selectors']:
  r=next((r for r in rects if r['selector']==sel),None)
  if not r or r.get('missing') or r['w']<=0 or r['h']<=0:raise ValueError(f'{lang}/{mode}/{f["raw"]}: {sel}')
  if r['y']>=image.height or r['y']+r['h']<=0:raise ValueError(f'Outside screenshot {lang}/{mode}/{f["raw"]}: {sel} {r}')
  selected.append(r)
 # Crop to the real controls, retaining a small amount of surrounding UI.
 left=max(0,math.floor(min(r['x'] for r in selected)-28));top=max(0,math.floor(min(r['y'] for r in selected)-35))
 right=min(image.width,math.ceil(max(r['x']+r['w'] for r in selected)+24));bottom=min(image.height,math.ceil(max(r['y']+r['h'] for r in selected)+24))
 if f['raw'] in ['portal','detail-public','interest','mobile']:left,top,right=0,0,image.width
 image=image.crop((left,top,right,bottom));draw=ImageDraw.Draw(image)
 for n,r in enumerate(selected,1):
  x=max(3,r['x']-left-4);y=max(3,r['y']-top-4);xx=min(image.width-4,r['x']+r['w']-left+4);yy=min(image.height-4,r['y']+r['h']-top+4)
  draw.rounded_rectangle((x,y,xx,yy),radius=6,outline=ORANGE,width=3)
  cx=min(image.width-17,max(17,x+10));cy=min(image.height-17,max(17,y+3))
  draw.ellipse((cx-15,cy-15,cx+15,cy+15),fill=ORANGE,outline='white',width=2)
  draw.text((cx,cy),str(n),fill='white',font=numberfont,anchor='mm')
 dest=ROOT/data['assets']/('mobile' if mode=='mobile' else '')/(f['raw']+'.jpg');dest.parent.mkdir(parents=True,exist_ok=True)
 image.save(dest,quality=88,optimize=True);f['width'],f['height']=image.size
 return dest,image

def para(c,text,x,y,w,size=10,bold=False):
 p=Paragraph(text,ParagraphStyle('p',fontName='GuideBold' if bold else 'Guide',fontSize=size,leading=size*1.35,textColor=HexColor(INK),spaceAfter=0))
 _,h=p.wrap(w,10000);p.drawOn(c,x,y-h);return y-h-8

def build(lang):
 suffix='' if lang=='es' else '-eu';eu=lang=='eu';tr=lambda es,ba:ba if eu else es
 source=ROOT/('data/ayuda-contenido'+suffix+'.json');data=json.loads(source.read_text('utf8'))
 images={}
 for t in data['topics']:
  for mode,key in [('desktop','figures'),('mobile','mobileFigures')]:
   for f in t[key]:
    k=(mode,f['raw'])
    if k not in images:images[k]=annotated(data,lang,mode,f)
    else:f['width'],f['height']=images[k][1].size
 source.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n','utf8')
 (ROOT/('data/ayuda-contenido'+suffix+'.js')).write_text('window.'+('UNI_HELP_CONTENT_EU' if eu else 'UNI_HELP_CONTENT')+'='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n','utf8')
 pdf=ROOT/data['pdf'];c=canvas.Canvas(str(pdf),pagesize=landscape(A4));W,H=landscape(A4)
 c.setTitle(tr('Uni Explorer · Guía de usuario','Uni Explorer · Erabiltzailearen gida'));c.setAuthor('Uni Explorer')
 def page(title,label=''):
  c.setFillColor(HexColor('#f4f8f9'));c.rect(0,0,W,H,fill=1,stroke=0)
  c.setFillColor(HexColor(TEAL));c.rect(0,H-12,W,12,fill=1,stroke=0)
  para(c,escape(title),34,H-30,W-68,18,True)
  c.setFont('Guide',8);c.setFillColor(HexColor('#526b79'));c.drawString(34,19,'Uni Explorer · '+tr('Revisión 06/11/2026','2026/11/06ko berrikuspena')+' · '+label);c.drawRightString(W-34,19,str(c.getPageNumber()))
 def end():c.showPage()
 page(tr('Guía de usuario','Erabiltzailearen gida'),tr('Castellano','Euskara'))
 y=H-110
 for text in [tr('Explora, compara y decide con información.','Arakatu, alderatu eta erabaki informazioarekin.'),tr('Manual actualizado con capturas reales de ordenador y móvil.','Ordenagailuko eta mugikorreko benetako pantaila-argazkiekin eguneratutako eskuliburua.'),tr('Incluye perfil, filtros, interés, comparador, acceso, costes, mapas, QEDU, UNED y otras enseñanzas.','Profila, iragazkiak, interesa, konparatzailea, sarbidea, kostuak, mapak, QEDU, UNED eta beste irakaskuntza batzuk barne.'),tr('Los círculos numerados señalan los controles descritos. Las cifras y elecciones de las capturas son ejemplos.','Zenbakitutako zirkuluek azaldutako kontrolak adierazten dituzte. Argazkietako zifrak eta aukerak adibideak dira.'),tr('La ayuda de la web permite cambiar entre capturas de ordenador y móvil. Cada idioma utiliza sus propias imágenes.','Webeko laguntzak ordenagailuko eta mugikorreko argazkien artean aldatzeko aukera ematen du. Hizkuntza bakoitzak bere irudiak erabiltzen ditu.')]:y=para(c,escape(text),45,y,W-90,14)
 c.linkURL(data['site'],(45,50,500,85));para(c,data['site'],45,78,W-90,11);end()
 page(tr('Temas del manual','Eskuliburuko gaiak'))
 y=H-85
 for n,t in enumerate(data['topics'],1):
  x=40 if n<=12 else W/2+15
  if n==13:y=H-85
  before=y;y=para(c,f'{n:02d}. {escape(t["title"])}',x,y,W/2-65,11)
  c.linkRect('',t['id'],(x,y+5,x+W/2-65,before),relative=0,thickness=0)
 end()
 seen={}
 for n,t in enumerate(data['topics'],1):
  page(f'{n:02d}. '+t['title'],tr('Cómo funciona','Nola funtzionatzen du'))
  c.bookmarkPage(t['id']);c.addOutlineEntry(t['title'],t['id'],level=0)
  y=para(c,escape(t['intro']),40,H-87,W-80,13)
  for tip in t['tips']:y=para(c,'• '+escape(tip),48,y,W-96,11)
  para(c,tr('Las páginas siguientes muestran las zonas numeradas. En móvil, los bloques se apilan y algunos controles cambian.','Hurrengo orriek zenbakitutako eremuak erakusten dituzte. Mugikorrean, blokeak bata bestearen azpian jartzen dira eta kontrol batzuk aldatzen dira.'),40,72,W-80,10)
  end()
  for mode,key in [('desktop','figures'),('mobile','mobileFigures')]:
   for f in t[key]:
    k=(mode,f['raw'])
    if k in seen:continue
    seen[k]=c.getPageNumber();path,im=images[k];mobile=mode=='mobile';label=tr('Móvil','Mugikorra') if mobile else tr('Ordenador','Ordenagailua')
    # Long real screens are split into readable consecutive sections in the PDF.
    scale=min((235 if mobile else W-80)/im.width,(H-145)/im.height) if mobile else (W-80)/im.width
    if mobile:scale=max(scale,min(0.58,235/im.width))
    maxh=H-145 if mobile else 325
    chunkh=max(1,int(maxh/scale));parts=math.ceil(im.height/chunkh)
    for part in range(parts):
     page(t['title'],label+(' · '+str(part+1)+'/'+str(parts) if parts>1 else ''))
     para(c,escape(f['caption']),40,H-75,W-80,11,True)
     start=part*chunkh;chunk=im.crop((0,start,im.width,min(im.height,start+chunkh)))
     c.drawInlineImage(chunk,40,H-110-chunk.height*scale,width=chunk.width*scale,height=chunk.height*scale)
     x=300 if mobile else 40;y=H-115 if mobile else H-120-chunk.height*scale
     width=W-340 if mobile else (W-100)/2
     for j,p in enumerate(f['points'],1):
      if not mobile:
       col=(j-1)%2;row=(j-1)//2;px=x+col*(width+20);py=y-row*58
      else:px=x;py=y
      ny=para(c,f'<b>{j}. {escape(p["title"])}</b><br/>{escape(p["text"])}',px,py,width,10)
      if mobile:y=ny-10
      if ny<35:raise ValueError(f'PDF legend overflow {lang} {f["raw"]}')
     end()
 c.save()
 print(lang,len(images),'captures',pdf.stat().st_size,'bytes')
 # Contact sheets of every final annotated capture for visual QA.
 thumbs=[]
 for (mode,raw),(path,im) in images.items():
  tile=Image.new('RGB',(250,205),'white');thumb=im.copy();thumb.thumbnail((242,175));tile.paste(thumb,((250-thumb.width)//2,22));ImageDraw.Draw(tile).text((5,3),mode+'/'+raw,fill=INK,font=ImageFont.truetype(str(FONT/'arial.ttf'),12));thumbs.append(tile)
 for index in range(0,len(thumbs),16):
  group=thumbs[index:index+16];sheet=Image.new('RGB',(1000,205*math.ceil(len(group)/4)),'#dce6e9')
  for j,tile in enumerate(group):sheet.paste(tile,((j%4)*250,(j//4)*205))
  sheet.save(OUT/f'contact-{lang}-{index//16+1}.jpg',quality=90)

for language in ['es','eu']:build(language)
