FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install all dependencies (including dev deps)
RUN npm install

# Copy the rest of your app (optional if using bind mount)
COPY . .

# Expose Vite default port
EXPOSE 8080

# Use non-root user (optional but good practice)
# RUN adduser -D appuser
# USER appuser

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
