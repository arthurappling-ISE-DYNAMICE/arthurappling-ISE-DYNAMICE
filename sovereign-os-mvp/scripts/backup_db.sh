#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/prime_pathwy_${TIMESTAMP}.db"
mkdir -p backups
sqlite3 prime_pathwy.db ".backup '$BACKUP_FILE'"
HASH=$(sha256sum "$BACKUP_FILE" | awk '{print $1}')
echo "$TIMESTAMP $BACKUP_FILE $HASH" >> backups/backups_manifest.txt
echo "Backup complete: $BACKUP_FILE | SHA-256: $HASH"
