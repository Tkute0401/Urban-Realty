# Use Node.js 18 for consistency
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build frontend or extract from zip
RUN cd client && \
    if [ -f "dist.zip" ]; then \
        echo "Extracting existing build from dist.zip..." && \
        unzip -o dist.zip; \
    else \
        echo "Building frontend..." && \
        npm run build; \
    fi

# Create necessary directories
RUN mkdir -p server/uploads
RUN mkdir -p logs

# Verify frontend build
RUN ls -la client/dist/ && \
    echo "Frontend build verification complete"

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server/server.js"]