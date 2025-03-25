#!/bin/bash

# Build the client
cd ../client
npm run build

# Copy client build to server's public directory
rm -rf ../server/public
mkdir -p ../server/public
cp -r build/* ../server/public/

# Return to server directory
cd ../server

# Install production dependencies
npm ci --production

# Create or update environment variables
echo "Creating .env file..."
cat > .env << EOL
PORT=${PORT:-5000}
NODE_ENV=production
MONGODB_URI=${MONGODB_URI}
CLIENT_URL=${CLIENT_URL}
SESSION_SECRET=${SESSION_SECRET}
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
GOOGLE_CALLBACK_URL=${GOOGLE_CALLBACK_URL}
EOL

echo "Deployment setup complete!" 