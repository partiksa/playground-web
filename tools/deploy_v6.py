#!/usr/bin/env python3
"""Zloží čistý priečinok na nasadenie (dist-v6) len zo súborov, ktoré web používa. Spustenie: python3 tools/deploy_v6.py"""
import shutil, pathlib, subprocess, sys
R = pathlib.Path(__file__).resolve().parent.parent
V, D = R / 'v6', R / 'dist-v6'
subprocess.run([sys.executable, str(R / 'tools/build_v6.py')], check=True)
shutil.rmtree(D, ignore_errors=True); D.mkdir()
for f in V.glob('*.html'): shutil.copy(f, D / f.name)
for f in V.glob('*.css'): shutil.copy(f, D / f.name)
for f in V.glob('*.js'):
    if f.name != 'review.js': shutil.copy(f, D / f.name)
for d in ['vendor', 'models', 'video', 'assets/depth', 'assets/obsah/img', 'frames/stavba', 'frames/render', 'ill/crayon']:
    shutil.copytree(V / d, D / d)
(D / 'fonts').mkdir()
for n in ['Switzer-Variable.woff2', 'CabinetGrotesk-Variable.woff2']: shutil.copy(V / 'fonts' / n, D / 'fonts' / n)
shutil.copy(V / 'assets/PLAYGROUND.svg', D / 'assets/PLAYGROUND.svg') if (V / 'assets/PLAYGROUND.svg').exists() else None
(D / '.htaccess').write_text('<IfModule mod_headers.c>\n<FilesMatch "\\.(html|css|js)$">\nHeader set Cache-Control "no-cache"\n</FilesMatch>\n</IfModule>\nAddType application/javascript .js\nAddType model/gltf-binary .glb\n')
print(sum(f.stat().st_size for f in D.rglob('*') if f.is_file()) // 1024 // 1024, 'MB,', sum(1 for f in D.rglob('*') if f.is_file()), 'súborov')
