# Multi-stage build for optimal image size and security
FROM python:3.13-slim

# Install uv - ultra-fast Python package installer
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set environment variables for uv
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
ENV UV_PYTHON_DOWNLOADS=never

# Create app directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock* ./

# Install dependencies using uv (much faster than pip)
RUN uv sync --frozen --no-install-project --no-dev

# Copy the rest of the application code
COPY ./agent.py .env agent/

# Install livekit packages
RUN uv run /app/agent/agent.py download-files

# Default command for development
CMD ["uv", "run", "/app/agent/agent.py", "dev"]