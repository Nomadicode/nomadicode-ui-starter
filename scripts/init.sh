#!/usr/bin/env bash
# Turn this template into a single-variant project, append the production setup guide to the README
# and register the site in nomadicode-infra.
set -euo pipefail

cd "$(dirname "$0")/.."

usage() {
	cat <<EOF >&2
Usage: ./scripts/init.sh <variant> <project-name> [options]

Variants: $(ls variants | tr '\n' ' ')

Options:
  --repo <org/repo>      GitHub repository (default: from the origin remote)
  --infra-dir <path>     nomadicode-infra checkout (default: \$NOMADICODE_INFRA_DIR)
  --domain <hostname>    Custom domain for the Cloudflare Pages project
  --apply                Also create the cloud resources (runs add-project.sh --apply)
EOF
	exit 1
}

variant="${1:-}"
name="${2:-}"
[[ -n "$variant" && -n "$name" && -d "variants/$variant" ]] || usage
shift 2

repo=""
infra_dir="${NOMADICODE_INFRA_DIR:-}"
infra_flags=()
while [[ $# -gt 0 ]]; do
	case "$1" in
		--repo) repo="${2:?--repo needs a value}"; shift 2 ;;
		--infra-dir) infra_dir="${2:?--infra-dir needs a value}"; shift 2 ;;
		--domain) infra_flags+=(--domain "${2:?--domain needs a value}"); shift 2 ;;
		--apply) infra_flags+=("$1"); shift ;;
		*) usage ;;
	esac
done

slug=$(echo "$name" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')
title=$(echo "$name" | sed -E 's/[\/&\\|#]//g')
if [[ -z "$slug" ]]; then
	echo "Project name must contain letters or digits." >&2
	exit 1
fi
app_id="com.nomadicode.${slug//-/}"

if [[ -z "$repo" ]]; then
	repo=$(git remote get-url origin 2>/dev/null | sed -E 's#^.*github\.com[:/]##; s#\.git$##') || true
fi
if [[ ! "$repo" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
	echo "Couldn't read the GitHub repository from the origin remote; pass --repo <org/repo>." >&2
	exit 1
fi

cp -a "variants/$variant/." .
rm -rf variants scripts/init.sh .github/workflows/template-ci.yml

grep -rIl -e "starter" -e "Starter" -e "__APP_ID__" . \
	--exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.nuxt \
	--exclude=pnpm-lock.yaml \
	| xargs -r sed -i -e "s/starter/$slug/g" -e "s/Starter/$title/g" -e "s/__APP_ID__/$app_id/g"

# Append the production setup guide to the README, keeping only this variant's sections: whole-line
# blocks first, then inline spans.
VARIANT="$variant" perl -0pi -e '
	my $keep = sub { my ($list, $body) = @_; (grep { $_ eq $ENV{VARIANT} } split / /, $list) ? $body : "" };
	s{^<!-- variant:([a-z ]+) -->\n(.*?)^<!-- /variant -->\n}{$keep->($1, $2)}gmse;
	s{<!-- variant:([a-z ]+) -->(.*?)<!-- /variant -->}{$keep->($1, $2)}gse;
	s{\n{3,}}{\n\n}g;
' scripts/setup-guide.md
sed -i -e "s#__PROJECT_NAME__#$title#g" -e "s#__GITHUB_REPO__#$repo#g" scripts/setup-guide.md
printf '\n' >> README.md
cat scripts/setup-guide.md >> README.md
rm scripts/setup-guide.md
rmdir scripts

echo "Initialised '$slug' with the $variant frontend for $repo."
if [[ "$variant" == "next" ]]; then
	echo "Next.js deploys as a Cloudflare Worker that Wrangler creates; nothing to register in nomadicode-infra."
else
	infra_command=(scripts/add-project.sh --name "$name" --web-repo "$repo" "${infra_flags[@]}")
	if [[ -n "$infra_dir" && -x "$infra_dir/scripts/add-project.sh" ]]; then
		(cd "$infra_dir" && "${infra_command[@]}")
		echo "Registered in $infra_dir/projects/$slug/production — review and commit it there."
	else
		echo "nomadicode-infra not found (set NOMADICODE_INFRA_DIR or pass --infra-dir). Register later with:"
		printf '  cd nomadicode-infra &&'
		printf ' %q' "${infra_command[@]}"
		echo
	fi
fi
echo "Next: follow \"Production setup\" in README.md, then cp .env.example .env && pnpm install"
