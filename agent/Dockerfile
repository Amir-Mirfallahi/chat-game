FROM python:3.13-alpine

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN uv init

# Copy requirements first for better caching
COPY requirements.txt /app

# Install dependencies
RUN uv add -r requirements.txt

# Copy the rest of the application
COPY . /app/agent

# Download necessary model files for VAD
RUN run /app/agent/agent.py download-files

# Expose port
EXPOSE 8000

