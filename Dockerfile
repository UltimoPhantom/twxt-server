# Use Node 20 base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy and install deps
COPY package*.json ./
RUN npm install --production

# Copy rest of the code
COPY . .

# Inject CLIENT_URL during build time
ARG CLIENT_URL
ENV CLIENT_URL=$CLIENT_URL

# Expose port
EXPOSE 5000

# Run the app
CMD [ "node", "index.js" ]
