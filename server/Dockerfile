# Use Node.js version 18
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all server files
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]