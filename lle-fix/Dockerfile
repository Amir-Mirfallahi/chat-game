FROM python:3.13-alpine

RUN pip install pipx
RUN pipx install uv

ENV PATH="/root/.local/bin:$PATH"
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY pyproject.toml uv.lock  /app/

RUN uv sync --locked

COPY . /app/backend

EXPOSE 8000
