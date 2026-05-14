# SNAPSHOT ENGINE ARCHITECTURE: Prime Pathwy Sovereign OS

## 1. Core Functionality
The Snapshot Engine is a critical component of the Prime Pathwy Sovereign OS, responsible for creating point-in-time, cryptographically verifiable backups of the entire operational state (database and file vault) without requiring system downtime.

## 2. Architectural Components

### 2.1 Database Snapshot Mechanism
To ensure data consistency while the system is actively processing transactions, the Snapshot Engine leverages SQLite's native Online Backup API.
- The engine acquires a shared read lock.
- It streams the contents of the active `prime_pathwy.db` to a temporary backup file.
- Because it uses the native API, it guarantees a transactionally consistent snapshot, avoiding the corruption risks associated with simply copying a live database file via the OS.

### 2.2 Vault Archival & Differential Sync
The Vault (`/data/vault`) contains the immutable physical evidence (receipts, photos, PDFs).
- To minimize I/O overhead during snapshots, the engine performs a differential sync (similar to `rsync`).
- It compares the current state of the Vault against the previous snapshot manifest.
- Only new or modified files (though modifications are rare due to the append-only architecture) are copied to the snapshot archive.

## 3. The Cryptographic Manifest
The defining feature of the Snapshot Engine is the Cryptographic Manifest. A backup is useless if its integrity cannot be proven.

### 3.1 Manifest Generation
Upon completing the database and vault sync, the engine generates a `manifest.json` file. This file contains:
- `snapshot_id`: A unique UUID.
- `timestamp`: ISO-8601 timestamp of snapshot initiation.
- `database_hash`: The SHA-256 hash of the copied SQLite database file.
- `vault_hashes`: A dictionary mapping every file path in the snapshot vault to its SHA-256 hash.

### 3.2 Manifest Signing
The `manifest.json` itself is then hashed, and this final "Master Hash" is recorded in the active database's `Snapshots` table. This creates a recursive integrity loop: the active database tracks the integrity of its own backups.

## 4. Restoration & Validation Procedures
When a restoration is required (due to corruption or hardware failure):
1. The administrator points the system to a snapshot archive.
2. The system reads `manifest.json`.
3. It recalculates the SHA-256 hash of the snapshot database and a random sample (or full scan) of the vault files.
4. It compares these calculations against the manifest.
5. If and only if the validation passes 100%, the system allows the snapshot to be promoted to the active operational state.
