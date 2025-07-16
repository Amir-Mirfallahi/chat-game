FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Download necessary model files for VAD
RUN python agent.py download-files

# Expose port (optional - LiveKit agents don't typically need exposed ports)
EXPOSE 8000

# Run the agent in production mode
CMD ["python", "agent.py", "start"]