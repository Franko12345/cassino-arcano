#!/usr/bin/env python3
"""Static-site check for Cassino Arcano (Vite + Svelte).

Verifica que o diretório dist/ foi gerado pelo build. O Vite gera
um único index.html + assets/, e o roteamento é client-side via hash.
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"

errors = []
required = [DIST / "index.html", DIST / "assets"]
for path in required:
    if not path.exists():
        errors.append(f"missing {path.relative_to(ROOT)}; run `npm run build`")

if not (DIST / "assets").is_dir() or not list((DIST / "assets").iterdir()):
    errors.append("dist/assets is empty")

if errors:
    print("\n".join(f"FAIL {error}" for error in errors))
    sys.exit(1)
print(f"PASS dist/ build artifacts present ({len(list((DIST / 'assets').iterdir()))} files in dist/assets)")

