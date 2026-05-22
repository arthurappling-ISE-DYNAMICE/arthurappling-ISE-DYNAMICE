.PHONY: run migrate test

run:
	bash scripts/run_dev.sh

migrate:
	alembic upgrade head

test:
	pytest tests/
