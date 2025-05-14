# Use the official Node image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose the port your backend runs on (e.g., 5000)
EXPOSE 5050

# Run with nodemon for hot-reloading
# RUN npm install -g nodemon
CMD ["node", "index.js"]