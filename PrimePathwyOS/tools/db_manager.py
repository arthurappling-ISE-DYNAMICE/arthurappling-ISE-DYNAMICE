import argparse
import sys
import os
from sqlalchemy import text

# Add the parent directory to sys.path to allow importing from app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database.connection import init_db, engine

def check_db_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"Database health check failed: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Prime Pathwy Database Manager")
    parser.add_argument("--init", action="store_true", help="Initialize the database and create tables")
    parser.add_argument("--health", action="store_true", help="Check database connection health")
    
    args = parser.parse_args()
    
    if args.init:
        print("Initializing database...")
        init_db()
        print("Database initialized successfully.")
    elif args.health:
        print("Checking database health...")
        if check_db_health():
            print("Database is healthy.")
        else:
            sys.exit(1)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
