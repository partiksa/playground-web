# Depth mapa (Depth Anything V2 Small) ku každej fotke: <foto>-d.webp, šírka 900. Spúšťa scripts/publish.mjs cez uv.
import sys,glob
from PIL import Image
from transformers import pipeline
p=pipeline("depth-estimation",model="depth-anything/Depth-Anything-V2-Small-hf")
for f in sys.argv[1:]:
    im=Image.open(f).convert("RGB")
    d=p(im)["depth"].convert("L").resize(im.size)
    w=900; d=d.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    out=f.replace(".webp","-d.webp"); d.save(out,"WEBP",quality=80); print(out)
