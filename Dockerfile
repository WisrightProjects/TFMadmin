# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (better for caching)
COPY package*.json ./

# Install dependencies with peer dependency fix
RUN npm install --legacy-peer-deps

# Disable CI so warnings don’t break build
ENV CI=false

# Copy all other project files
COPY . .

# Build the React app
RUN npm run build

# Expose default React port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
