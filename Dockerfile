# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Set environment variable from build arg
ARG CLIENT_URL
ENV CLIENT_URL=$CLIENT_URL

# Expose the app port
EXPOSE 5000

# Run the server
CMD ["node", "index.js"]
