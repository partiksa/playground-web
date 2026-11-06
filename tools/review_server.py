#!/usr/bin/env python3
"""Lokálny server pre v6 s ukladaním poznámok ku prvkom stránky.
Spustenie: python3 tools/review_server.py [port]   (predvolene 8914)
Otvoriť:   http://127.0.0.1:8914/index.html?review
Poznámky:  poznamky.json v koreni projektu (čítam ich odtiaľ)."""
import json, sys, threading, time, uuid, pathlib
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / 'v6'
NOTES = ROOT / 'poznamky.json'
LOCK = threading.Lock()


def load():
    try:
        return json.loads(NOTES.read_text(encoding='utf-8'))
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def store(notes):
    tmp = NOTES.with_suffix('.tmp')
    tmp.write_text(json.dumps(notes, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(NOTES)


class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(SITE), **k)

    # bez cache: inak prehliadač drží staré main.js, play3d.js a style.css aj po Cmd+Shift+R
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def _json(self, code, data):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.startswith('/api/notes'):
            with LOCK:
                return self._json(200, load())
        return super().do_GET()

    def do_POST(self):
        if not self.path.startswith('/api/notes'):
            return self._json(404, {'error': 'not found'})
        try:
            n = int(self.headers.get('Content-Length', 0))
            if n > 200_000:
                return self._json(413, {'error': 'too large'})
            d = json.loads(self.rfile.read(n) or b'{}')
        except (ValueError, json.JSONDecodeError):
            return self._json(400, {'error': 'bad json'})
        note = {k: d.get(k) for k in ('page', 'selector', 'tag', 'text', 'note', 'viewport', 'scroll', 'rect')}
        if not (note['note'] or '').strip():
            return self._json(400, {'error': 'empty note'})
        note['id'] = uuid.uuid4().hex[:8]
        note['time'] = time.strftime('%Y-%m-%d %H:%M:%S')
        with LOCK:
            notes = load(); notes.append(note); store(notes)
        return self._json(201, note)

    def do_DELETE(self):
        nid = self.path.rsplit('id=', 1)[-1] if 'id=' in self.path else ''
        with LOCK:
            notes = load(); left = [n for n in notes if n.get('id') != nid]; store(left)
        return self._json(200, {'deleted': len(notes) - len(left)})

    def log_message(self, fmt, *args):
        if '/api/' in (args[0] if args else ''):
            super().log_message(fmt, *args)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8914
    print(f'http://127.0.0.1:{port}/index.html?review  ->  {NOTES}')
    ThreadingHTTPServer(('127.0.0.1', port), H).serve_forever()
