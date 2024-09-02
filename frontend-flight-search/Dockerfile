# Dockerfile for the React frontend

# Use the official Node.js image with the correct version
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the default Vite port
EXPOSE 5173

# Command to start the Vite development server
CMD ["npm", "run", "dev", "--", "--host"]
