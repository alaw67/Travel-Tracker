# Use official Node image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose React dev server port (default 3000)
EXPOSE 3000

# Start React dev server
CMD ["npm", "start"]
