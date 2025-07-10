FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r ./requirements.txt -i https://mirror-pypi.runflare.com/simple


EXPOSE 8000
