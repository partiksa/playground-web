import os, json, base64, urllib.request, sys
# 5 s video detí na ihrisku pre v6, dokumentárny pohyb kamery. Strop 0,7 USD (5 s je asi 0,5 USD).
KEY = os.environ["GEMINI_API_KEY"]
OUT = "/Users/patriksarkozy/Desktop/AI/loso/v6/video/hero-deti.mp4"
REF = "/tmp/ref-deti.jpg"
PROMPT = (
"Image1 is a reference photo of a real indoor soft-play structure we built: red quilted vinyl columns, yellow and orange padded bars, black knotted netting, "
"yellow padded platform, light blue slide, ball pit, orange resin floor. Use the same playground, same room and same materials. "
"Documentary-style footage, exactly 5 seconds, one continuous shot, no cuts. "
"Four young children aged 4 to 7, natural and unposed, play inside and around the structure: one slides down the blue slide laughing, one climbs the netting, "
"one tumbles into the ball pit and a few balls pop up, one runs across the platform. Real kids moving naturally, spontaneous joyful play, nobody looks at the camera. "
"Camera: a slow gentle push-in with a very slight handheld drift like a documentary cameraman, subtle micro-shake, shallow depth of field, focus gently follows the action. "
"Warm natural window light, realistic exposure, true-to-life colors, fine film-like grain. "
"No text, no logos, no watermark, no subtitles, no adults in frame, no fast cuts, no slow motion, no distorted limbs.")
def b64(p): return base64.b64encode(open(p, "rb").read()).decode()
body = {"model": "gemini-omni-1.1-flash",
  "input": [{"type": "image", "data": b64(REF), "mime_type": "image/jpeg"}, {"type": "text", "text": PROMPT}],
  "response_format": {"type": "video", "aspect_ratio": "16:9", "resolution": "720p"}}
req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/interactions",
    data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": KEY})
try:
    r = urllib.request.urlopen(req, timeout=590).read()
except urllib.error.HTTPError as e:
    print("ERR", e.code, e.read()[:800]); sys.exit(1)
d = json.loads(r)
u = d.get("usage", {})
print(d.get("status"), "output_tokens", u.get("total_output_tokens"), "odhad USD", round((u.get("total_output_tokens") or 0) * 1.01 / 57920, 2))
for s in d.get("steps", []):
    for c in s.get("content", []) if isinstance(s.get("content"), list) else []:
        if c.get("type") == "video" and c.get("data"):
            open(OUT, "wb").write(base64.b64decode(c["data"])); print("VIDEO OK", OUT)
