# Use an official Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# COPY . .

# Install dependenciesf
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the React app runs on
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
