# Set the base image
ARG PYTHON_VERSION=3.10-slim
FROM python:${PYTHON_VERSION}

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create the static files directory
RUN mkdir -p /code

# Set the working directory to the root of your Django project
WORKDIR /code

# Install dependencies for psycopg2
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install the required Python dependencies
COPY requirements.txt /tmp/requirements.txt

RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /root/.cache/

# Copy your application files into the Docker image
COPY . /code/

# Set environment variables
# Set SECRET_KEY for building purposes
# ENV SECRET_KEY "non-secret-key-for-building-purposes"

# Collect static files into /staticfiles directory
RUN python manage.py collectstatic --noinput

# Expose the port
EXPOSE 8000

# Set the command to run the application with gunicorn
CMD ["gunicorn", "--bind", ":8000", "--workers", "2", "base.wsgi"]