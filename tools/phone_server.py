#!/usr/bin/env python3
"""Statický náhľad v6 pre mobil v rovnakej Wi-Fi (bez API poznámok, bez cache). Spustenie: python3 tools/phone_server.py [port]"""
import sys, pathlib
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
SITE = pathlib.Path(__file__).resolve().parent.parent / 'v6'


class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(SITE), **k)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', int(sys.argv[1]) if len(sys.argv) > 1 else 8915), H).serve_forever()
