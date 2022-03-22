# Extend the official Rasa SDK image
FROM rasa/rasa:2.8.2-full

# Use subdirectory as working directory
WORKDIR /app

# Change back to root user to install dependencies
USER root
RUN apt-get clean && apt-get update
RUN apt install --yes build-essential
RUN python -m pip install --upgrade pip
# To install system dependencies
# RUN apt-get update -qq && \

# To install packages from PyPI
# COPY  ./tmp/requirements.txt /tmp/requirements.txt
RUN pip install -U spacy==3.2.1 spacy_fastlang==1.0.1
RUN python -m spacy download de_core_news_md

# Copy actions folder to working directory
COPY . .

# Switch back to non-root to run code
USER 1001
