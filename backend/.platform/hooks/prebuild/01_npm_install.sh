#!/bin/bash

# Navigate to the app directory
cd /var/app/staging

# Install dependencies
npm ci --production

# Ensure the script exits with success
exit 0 