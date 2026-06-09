FROM python:3.11-slim

RUN apt-get update && apt-get install -y tesseract-ocr libmagic1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY pyproject.toml .
RUN pip install poetry && poetry install --no-root

COPY . .

RUN useradd -m pathwy_user && chown -R pathwy_user:pathwy_user /app
USER pathwy_user

CMD ["uvicorn", "src.main:app", "--host", "127.0.0.1", "--port", "8000"]
