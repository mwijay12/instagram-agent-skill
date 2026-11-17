#!/usr/bin/env bash
# Sakinisha voice.md sahihi kwa akaunti unayoandikia.
# Skills zote za repo hii zinasoma ~/.claude/instagram/voice.md (faili MOJA tu),
# kwa hiyo unabadilisha kwa ku-copy, si kwa symlink ya pili.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${HOME}/.claude/instagram"

case "${1:-}" in
  mwijay|mwijay__davie)
    SRC="$HERE/03-voice-mwijay.md"; LABEL="@mwijay__davie" ;;
  altraware|altrawaretechnology)
    SRC="$HERE/04-voice-altraware.md"; LABEL="@altrawaretechnology" ;;
  *)
    echo "Usage: $0 {mwijay|altraware}" >&2
    echo "  mwijay     -> @mwijay__davie (akaunti ya kibinafsi)" >&2
    echo "  altraware  -> @altrawaretechnology (studio)" >&2
    exit 1 ;;
esac

mkdir -p "$DEST"
# Hifadhi nakala ya ile iliyopo kabla ya kuibadilisha.
if [ -f "$DEST/voice.md" ]; then
  cp "$DEST/voice.md" "$DEST/voice.previous.md"
fi
cp "$SRC" "$DEST/voice.md"
echo "voice.md installed for $LABEL -> $DEST/voice.md"
echo "Previous file (if any): $DEST/voice.previous.md"
