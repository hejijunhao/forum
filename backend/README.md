# Forum Backend

FastAPI backend for Forum - a lightweight developer workspace.

## Setup

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -e ".[dev]"

# Run development server
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- OpenAPI docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
