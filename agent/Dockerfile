FROM python:3.13-alpine

<<<<<<< HEAD
=======
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

>>>>>>> c90391a (Add agent feature and Docker support)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

<<<<<<< HEAD
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
=======
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

# Run the agent in production mode
# CMD ["python", "agent.py", "start"]
>>>>>>> c90391a (Add agent feature and Docker support)
