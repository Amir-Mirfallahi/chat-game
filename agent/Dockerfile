# Multi-stage build for optimal image size and security
FROM python:3.13-slim as builder

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

# Production stage
FROM python:3.11-slim as production

# Install uv in production image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Create non-root user for security
RUN groupadd -r agent && useradd -r -g agent agent

# Set up directory structure
WORKDIR /app
RUN chown agent:agent /app

# Copy virtual environment from builder stage
COPY --from=builder --chown=agent:agent /app/.venv /app/.venv

# Ensure we use the venv
ENV PATH="/app/.venv/bin:$PATH"
ENV VIRTUAL_ENV="/app/.venv"

# Copy application code
COPY --chown=agent:agent agent.py ./
COPY --chown=agent:agent pyproject.toml ./

# Switch to non-root user
USER agent

# Health check endpoint (optional - requires production dependencies)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import sys; sys.exit(0)"

# Default command
CMD ["python", "agent.py", "start"]

# Development stage
FROM builder as development

# Install development dependencies
RUN uv sync --frozen --no-install-project

# Copy application code
COPY --chown=agent:agent . .

# Switch to non-root user
USER agent

# Default command for development
CMD ["python", "agent.py", "dev"]