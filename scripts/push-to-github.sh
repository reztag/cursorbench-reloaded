#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "GH_TOKEN is not set. Add a GitHub PAT with repo contents write access." >&2
  exit 1
fi

export GIT_TERMINAL_PROMPT=0
git remote get-url github >/dev/null 2>&1 || \
  git remote add github https://github.com/reztag/cursorbench-reloaded.git

git -c "http.extraHeader=AUTHORIZATION: bearer ${GH_TOKEN}" push -u github main
