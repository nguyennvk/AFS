FROM node:20-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY . .
# Install dependencies
RUN npm install
RUN npx prisma generate
# Copy the rest of the application code


# Build the application (ensure you have a build script in your package.json)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["sh", "-c", "npx prisma migrate dev && npx prisma generate && node data/fetch.js && node data/populate_data.js && npm run dev"]
# CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node data/fetch.js && node data/populate_data.js && npm run"]

