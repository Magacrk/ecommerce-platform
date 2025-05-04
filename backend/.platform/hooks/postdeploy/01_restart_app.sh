#!/bin/bash

# Navigate to the app directory
cd /var/app/current

# Create log directory if it doesn't exist
mkdir -p /var/app/current/logs

# Set proper permissions for the log directory
chmod 777 /var/app/current/logs

# Restart the Node.js application
pm2 restart app.js || pm2 start app.js

# Ensure the script exits with success
exit 0 