#!/usr/bin/env python3
"""
PRIME PATHWY: SOVEREIGN ROUTER & CREDIT AUDITOR
WAT-compliant automated directory router and validation engine.

This tool enforces directory compliance:
- Workflows (.md) -> /workflows
- Agents (Prompts) -> /agents
- Tools (Scripts/Python) -> /tools
- Temporary/Data -> /temporary
"""

import os
import sys
import argparse
import csv
from datetime import datetime

# Define standard WAT paths relative to the repository root
WAT_MAP = {
    '.md': {
        'workflows': 'workflows',
        'agents': 'agents',
        'temporary': 'temporary'
    },
    '.py': 'tools',
    '.js': 'tools',
    '.sh': 'tools',
    '.csv': 'temporary',
    '.json': 'temporary',
    '.xlsx': 'temporary'
}

def log_audit(category, asset_name, path, status, message=""):
    """Logs the execution cycle into the Sovereign Master Ledger."""
    ledger_path = os.path.join(os.path.dirname(__file__), '../temporary/MASTER_EXECUTION_LEDGER.csv')
    file_exists = os.path.isfile(ledger_path)
    
    row = {
        'Timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'Category': category,
        'Asset Name': asset_name,
        'Path': path,
        'Status': status,
        'Message': message
    }
    
    try:
        with open(ledger_path, 'a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=row.keys())
            if not file_exists:
                writer.writeheader()
            writer.writerow(row)
        print(f"[*] Audit successfully logged to MASTER_EXECUTION_LEDGER.csv")
    except Exception as e:
        print(f"[!] Failed to log audit: {e}", file=sys.stderr)

def validate_wat_compliance(file_path, target_wat_dir=None):
    """Validates if a file path strictly complies with WAT directory rules."""
    abs_path = os.path.abspath(file_path)
    base_name = os.path.basename(abs_path)
    _, ext = os.path.splitext(base_name)
    ext = ext.lower()
    
    parent_dir = os.path.basename(os.path.dirname(abs_path))
    
    print(f"[*] Auditing file: {base_name} (extension: {ext}) in parent directory: {parent_dir}")
    
    # Rule 1: Code files must be in /tools
    if ext in ['.py', '.js', '.sh', '.ps1']:
        if parent_dir != 'tools':
            return False, f"Code files with extension {ext} must reside in /tools, not /{parent_dir}."
        return True, "Valid Code Asset"
        
    # Rule 2: Data/Log files must be in /temporary
    if ext in ['.csv', '.json', '.xlsx', '.log']:
        if parent_dir != 'temporary':
            return False, f"Data files with extension {ext} must reside in /temporary, not /{parent_dir}."
        return True, "Valid Data/Temporary Asset"
        
    # Rule 3: Markdown files can be workflows, agents, or temporary
    if ext == '.md':
        allowed_md_dirs = ['workflows', 'agents', 'temporary']
        if parent_dir not in allowed_md_dirs:
            return False, f"Markdown files (.md) must reside in /workflows, /agents, or /temporary, not /{parent_dir}."
        
        if target_wat_dir and parent_dir != target_wat_dir:
            return False, f"Expected markdown file in /{target_wat_dir}, but found in /{parent_dir}."
            
        return True, f"Valid Markdown Asset (Type: {parent_dir})"
        
    return True, "Asset bypassed standard WAT extension mapping (custom extension)"

def main():
    parser = argparse.ArgumentParser(description="Prime Pathwy Sovereign Router & WAT Auditor")
    parser.add_argument('--file', required=True, help="Path to the file to audit/route")
    parser.add_argument('--category', choices=['A', 'B', 'C', 'D'], required=True, help="Execution Category (A: Rev, B: Ops, C: Intel, D: Asset)")
    parser.add_argument('--type', choices=['workflows', 'agents', 'temporary', 'tools'], help="Target WAT directory override")
    parser.add_argument('--log-only', dest='log_only', action='store_true', help="Only log execution, do not fail on WAT mismatch")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.file):
        print(f"[!] Error: File '{args.file}' does not exist.", file=sys.stderr)
        sys.exit(1)
        
    is_compliant, msg = validate_wat_compliance(args.file, args.type)
    
    status = "COMPLIANT" if is_compliant else "NON-COMPLIANT"
    print(f"[{'✓' if is_compliant else '✗'}] WAT Audit Status: {status} - {msg}")
    
    # Log the execution
    asset_name = os.path.basename(args.file)
    log_audit(
        category=f"CATEGORY_{args.category}",
        asset_name=asset_name,
        path=os.path.relpath(args.file),
        status=status,
        message=msg
    )
    
    if not is_compliant and not args.log_only:
        print("[!] Execution halted due to WAT Non-Compliance.", file=sys.stderr)
        sys.exit(1)
        
    print("[+] Sovereign Build Directive execution completed successfully.")

if __name__ == '__main__':
    main()
