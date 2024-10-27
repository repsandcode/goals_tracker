ARG PYTHON_VERSION=3.10-slim

FROM python:${PYTHON_VERSION}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install psycopg2 dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create a writable directory for static files
RUN mkdir -p /staticfiles
RUN chmod 777 /staticfiles  # Ensures the directory is writable

# Set the working directory to the root base folder (where manage.py is)
WORKDIR /base  # This points to the directory containing manage.py

# Copy the project files into the container
COPY . /base

# Install Python dependencies
COPY requirements.txt /tmp/requirements.txt
RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /root/.cache/

# Set environment variables
ENV SECRET_KEY="IgH6mXSu41i3qXzDaTLwMHKBRSM77iLUukCLx7g8673GcglFoF"

# Collect static files into /staticfiles directory
RUN python manage.py collectstatic --noinput

# Expose the port
EXPOSE 8000

# Start the application using Gunicorn
CMD ["gunicorn", "--bind", ":8000", "--workers", "2", "base.wsgi:application"]