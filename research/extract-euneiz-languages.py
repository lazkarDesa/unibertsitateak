import json,re
from pathlib import Path
from pypdf import PdfReader
jobs=json.loads(Path('research/qedu-euneiz-memory-jobs.json').read_text(encoding='utf-8'))
checked=json.loads(Path('research/qedu-private-fetch-meta.json').read_text(encoding='utf-8-sig'))['checked']
out=[]
for j in jobs:
 reader=PdfReader(j['file']); first=reader.pages[0].extract_text() or ''; title=re.search(r'Identificador\s*:\s*(\d+)',first)
 for n,page in enumerate(reader.pages[:8]):
  text=page.extract_text() or ''
  if 'CASTELLANO' in text:
   following=text[text.index('CASTELLANO'):]
   # Tables may continue onto the next page.
   if n+1<len(reader.pages): following+='\n'+(reader.pages[n+1].extract_text() or '')
   rows=re.findall(r'\b(Sí|No)\s+(Sí|No)\s+(Sí|No)\b',following[:2500])
   language='Castellano' if len(rows)>=2 and rows[0]==('Sí','No','No') and rows[1]==('No','No','No') else None
   out.append({'checked':checked,'id':j['id'],'recordTitle':title.group(1) if title else None,'language':language,'page':n+1,'source':j['url'],'note':None if language else 'La memoria enumera numerosas lenguas; la docencia efectiva requiere confirmación.'})
   break
Path('research/qedu-euneiz-language-evidence.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(out,ensure_ascii=False))
