# Use Ubuntu as base image
FROM ubuntu:20.04

# Set environment variables to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Update system and install dependencies (Git, Curl, Node.js, Nginx, Certbot)
RUN apt update -y && apt upgrade -y  2>/dev/null
#Install Git
RUN apt install git -y
#Install NextJS + Latest Node Versions
RUN apt install curl -y
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install nodejs -y
RUN node -v && npm -v

# Clone the repository
COPY . /app

# Set working directory
WORKDIR /app

# Install npm dependencies
RUN npm install --force  2>/dev/null

# Expose necessary ports
EXPOSE 3007

# Define startup script to start both Nginx and the app
CMD npm run production