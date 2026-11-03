import os, json, base64, urllib.request, sys
# Test hero video pre v6: 5 s, 720p, 16:9, len textový prompt (žiadne reálne fotky detí). Odhad ceny asi 0,50 USD.
KEY = os.environ["GEMINI_API_KEY"]
OUT = "/Users/patriksarkozy/Desktop/AI/loso/v6/video/hero.mp4"
PROMPT = (
"Photorealistic, warm natural light, locked-off camera, no cuts, about 5 seconds. "
"Inside a bright indoor children's playground with red padded columns, yellow and orange padded bars, black safety nets, a light blue slide and a ball pit. "
"Four or five cartoon-like but realistic children aged 3 to 7 play: one slides down the blue slide, one jumps into the ball pit and balls fly up, two climb the netting, one waves. "
"Smooth natural motion, joyful mood, soft focus background, no text, no logos, no watermark, no adults in focus.")
body = {"model": "gemini-omni-1.1-flash", "input": [{"type": "text", "text": PROMPT}],
        "response_format": {"type": "video", "aspect_ratio": "16:9", "resolution": "720p"}}
req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/interactions",
    data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": KEY})
try:
    r = urllib.request.urlopen(req, timeout=590).read()
except urllib.error.HTTPError as e:
    print("ERR", e.code, e.read()[:800]); sys.exit(1)
d = json.loads(r)
print({k: d.get(k) for k in ("id", "status", "usage")})
for s in d.get("steps", []):
    for c in s.get("content", []) if isinstance(s.get("content"), list) else []:
        if c.get("type") == "video" and c.get("data"):
            open(OUT, "wb").write(base64.b64decode(c["data"])); print("VIDEO OK", OUT)
