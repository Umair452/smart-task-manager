# Start with Node.js 20 on lightweight Linux
FROM node:20-alpine

# All work happens in /app folder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema
COPY prisma ./prisma/

# Install packages
RUN npm install --omit=dev

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# App runs on port 3000
EXPOSE 3000

# Start the app
CMD ["node", "src/app.js"]
