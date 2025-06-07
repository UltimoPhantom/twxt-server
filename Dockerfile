# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and lock file first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the code
COPY . .

# Your app runs on port 3000 (adjust if needed)
EXPOSE 5000

# Define the command to run your app
CMD [ "node", "index.js" ]
