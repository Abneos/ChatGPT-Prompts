#!/usr/bin/env python3
"""Deterministic logo placement from approved registry artwork. Requires Pillow and CairoSVG for SVG inputs."""
import argparse, hashlib, io, json
from pathlib import Path
from PIL import Image

def approved_asset(root, brand, variant):
    data=json.loads((root/"brand-registry/brands.json").read_text())
    record=data["brands"].get(brand)
    if not record or record["status"]!="approved":
        raise ValueError(f"{brand}: brand has no approved artwork")
    item=record["assets"].get(variant)
    if not item: raise ValueError(f"{brand}: missing approved variant {variant}")
    file=(root/item["path"]).resolve()
    base=(root/"brand-registry/assets").resolve()
    if not file.is_relative_to(base): raise ValueError("Unsafe asset path")
    if hashlib.sha256(file.read_bytes()).hexdigest()!=item["sha256"]:
        raise ValueError("Approved asset checksum mismatch")
    return file

def load_rgba(path):
    if path.suffix.lower()==".svg":
        try: import cairosvg
        except ImportError as exc: raise RuntimeError("Install cairosvg for SVG input") from exc
        return Image.open(io.BytesIO(cairosvg.svg2png(bytestring=path.read_bytes()))).convert("RGBA")
    return Image.open(path).convert("RGBA")

def render(root,brand,variant,background,output,anchor,margin,max_fraction):
    logo=load_rgba(approved_asset(root,brand,variant))
    bg=Image.open(background).convert("RGBA")
    max_w=int(bg.width*max_fraction)
    max_h=int(bg.height*0.35)
    ratio=min(1,max_w/logo.width,max_h/logo.height)
    logo=logo.resize((max(1,round(logo.width*ratio)),max(1,round(logo.height*ratio))),Image.Resampling.LANCZOS)
    if anchor=="bottom-right": x=bg.width-margin-logo.width; y=bg.height-margin-logo.height
    elif anchor=="bottom-left": x=margin; y=bg.height-margin-logo.height
    elif anchor=="top-left": x=margin; y=margin
    else: x=bg.width-margin-logo.width; y=margin
    if x<0 or y<0: raise ValueError("Logo exceeds safe area")
    bg.alpha_composite(logo,(x,y))
    output.parent.mkdir(parents=True,exist_ok=True)
    bg.save(output)

if __name__=="__main__":
    p=argparse.ArgumentParser()
    p.add_argument("--brand",required=True);p.add_argument("--variant",default="primary")
    p.add_argument("--background",type=Path,required=True);p.add_argument("--output",type=Path,required=True)
    p.add_argument("--anchor",choices=["bottom-right","bottom-left","top-left","top-right"],default="bottom-right")
    p.add_argument("--margin",type=int,default=64);p.add_argument("--max-width-fraction",type=float,default=0.32)
    p.add_argument("--registry-root",type=Path,default=Path(__file__).resolve().parents[1])
    a=p.parse_args()
    if not 0<a.max_width_fraction<=1: p.error("invalid max width fraction")
    if a.margin<0:p.error("margin cannot be negative")
    render(a.registry_root.resolve(),a.brand,a.variant,a.background,a.output,a.anchor,a.margin,a.max_width_fraction)
