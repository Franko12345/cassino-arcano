#!/usr/bin/env bash
# Cria uma nova spec a partir do template.
# Uso: scripts/new-spec.sh <slug>
# Resultado: docs/specs/<slug>.md pronto para edição.
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Uso: $0 <slug>" >&2
  exit 1
fi

slug="$1"
if [ -e "docs/specs/${slug}.md" ]; then
  echo "docs/specs/${slug}.md já existe." >&2
  exit 1
fi

cp docs/specs/0000-template.md "docs/specs/${slug}.md"
echo "Criado docs/specs/${slug}.md"
echo
echo "Próximos passos:"
echo "  1. abrir a spec e preencher o template"
echo "  2. abrir issue com o template 'spec' e linkar"
echo "  3. após revisão, criar branch feat/<issue>-${slug}"
