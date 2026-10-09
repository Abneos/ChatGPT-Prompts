"""Validate copy lengths and evidence; never infer live platform compliance."""
import argparse,json,sys
from datetime import date
from pathlib import Path

def validate(pack, today=None):
 today=today or date.today(); results=[]
 selected=pack.get('platforms',[])
 if not selected:results.append({'status':'FAIL','reason':'No platforms selected'})
 for row in pack.get('fields',[]):
  text=row.get('copy',''); convention=row.get('counting','codepoints')
  n=len(text.encode('utf-16-le'))//2 if convention=='utf16' else len(text)
  lo=row.get('min');hi=row.get('max')
  invalid=(hi is not None and n>hi) or (lo is not None and n<lo)
  results.append({'platform':row.get('platform'),'field':row.get('field'),'characters':n,'status':'FAIL' if invalid else 'PASS','reason':'Copy length only; not platform verification'})
  if row.get('platform') not in selected:results.append({'status':'FAIL','reason':'Field for unselected platform'})
 for row in pack.get('fields',[]):
  if not any(r.get('platform')==row.get('platform') and r.get('field')==row.get('field') for r in pack.get('requirements',[])):
   results.append({'status':'WARNING','reason':'No field-specific evidence for '+str(row.get('field'))})
 for r in pack.get('requirements',[]):
  checked=r.get('checked_at');age=None
  try:age=(today-date.fromisoformat(checked)).days if checked else None
  except (ValueError,TypeError):pass
  good=r.get('status')=='verified' and r.get('source_url') and r.get('source_type')=='official' and age is not None and 0<=age<=30
  results.append({'requirement':r.get('id'),'status':'PASS' if good else 'WARNING','reason':'Evidence current' if good else 'Needs official verification; not upload-ready'})
 if not pack.get('requirements'):results.append({'status':'WARNING','reason':'No verified requirements supplied'})
 for platform in selected:
  if not any(r.get('platform')==platform for r in pack.get('requirements',[])):results.append({'status':'WARNING','reason':'No requirements evidence for '+platform})
 return results

if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('pack');a.add_argument('--output');args=a.parse_args()
 report=validate(json.loads(Path(args.pack).read_text()));s=json.dumps(report,indent=2)
 if args.output:Path(args.output).write_text(s+'\n')
 print(s);sys.exit(1 if any(r['status']=='FAIL' for r in report) else 0)
