#!/usr/bin/env bash
# Cria um novo ADR a partir do template.
# Uso: scripts/new-adr.sh <slug>
# Resultado: docs/adr/NNNN-<slug>.md, com número sequencial.
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Uso: $0 <slug>" >&2
  exit 1
fi

slug="$1"
mkdir -p docs/adr
last=$(ls docs/adr/ 2>/dev/null | grep -E '^[0-9]{4}-' | sort | tail -1 || true)
if [ -z "$last" ]; then
  number=1
else
  number=$((10#$(echo "$last" | cut -d- -f1) + 1))
fi
next=$(printf '%04d' "$number")

if [ -e "docs/adr/${next}-${slug}.md" ]; then
  echo "docs/adr/${next}-${slug}.md já existe." >&2
  exit 1
fi

cp docs/adr/0000-template.md "docs/adr/${next}-${slug}.md"
echo "Criado docs/adr/${next}-${slug}.md"
