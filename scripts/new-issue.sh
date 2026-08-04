#!/usr/bin/env bash
# Abre uma issue no GitHub com o template especificado.
# Uso: scripts/new-issue.sh <spec|bug|chore|setup> "<título>"
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Uso: $0 <spec|bug|chore|setup> <título> [corpo...]" >&2
  exit 1
fi

type="$1"
shift
title="$1"
shift

case "$type" in
  spec|bug|chore|setup) ;;
  *) echo "Tipo inválido: $type" >&2; exit 1 ;;
esac

if ! command -v gh >/dev/null 2>&1; then
  echo "gh não instalado" >&2
  exit 1
fi

gh issue create --label "$type" --title "$title" --body "$*"
