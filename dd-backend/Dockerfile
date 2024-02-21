
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Create dist/images directory
RUN mkdir -p dist/images

# Copy package.json and package-lock.json to the working directory
COPY src ./src
COPY package*.json ./
COPY package-lock.json ./
COPY .env ./

# Install dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port on which the app will run
EXPOSE 8080

# Define the command to run your application
CMD ["npm", "run", "dev"]


