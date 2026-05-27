FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port (Railway overrides this via PORT env var)
EXPOSE $PORT

# Start command
CMD ["npm", "start"]
