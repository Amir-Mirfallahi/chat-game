FROM python:3.13-alpine

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN uv init

COPY pyproject.toml uv.lock  /app

RUN uv sync --locked

COPY . /app/backend

EXPOSE 8000
