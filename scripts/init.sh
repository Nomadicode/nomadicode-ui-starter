#!/usr/bin/env bash
# Turn this template into a single-variant project.
# Usage: ./scripts/init.sh <expo|nuxt|next> <project-name>
set -euo pipefail

cd "$(dirname "$0")/.."

variant="${1:-}"
name="${2:-}"

if [[ -z "$variant" || -z "$name" || ! -d "variants/$variant" ]]; then
	echo "Usage: ./scripts/init.sh <variant> <project-name>" >&2
	echo "Variants: $(ls variants | tr '\n' ' ')" >&2
	exit 1
fi

slug=$(echo "$name" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')
title=$(echo "$name" | sed -E 's/[\/&\\|]//g')
if [[ -z "$slug" ]]; then
	echo "Project name must contain letters or digits." >&2
	exit 1
fi

cp -a "variants/$variant/." .
rm -rf variants scripts .github/workflows/template-ci.yml

grep -rIl -e "starter" -e "Starter" . \
	--exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.nuxt \
	--exclude=pnpm-lock.yaml \
	| xargs -r sed -i -e "s/starter/$slug/g" -e "s/Starter/$title/g"

echo "Initialised '$slug' with the $variant frontend."
echo "Next: cp .env.example .env && pnpm install"
