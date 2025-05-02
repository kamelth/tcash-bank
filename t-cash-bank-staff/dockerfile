# Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source & build
COPY . .
RUN npm run build

# Your app listens on 3000 by default
EXPOSE 3000

# Start the compiled JS
CMD ["node", "dist/app.js"]
