#!/bin/bash

# Navigate to the app directory
cd /var/app/current

# Create log directory if it doesn't exist
mkdir -p /var/app/current/logs

# Set proper permissions for the log directory
chmod 777 /var/app/current/logs

# The application should be started by the platform via Procfile
# Just ensure logs are properly saved

# Ensure the script exits with success
exit 0 