# ----------------------------
# Stage 1: Builder
# ----------------------------
    FROM node:20-bullseye AS builder

    WORKDIR /app
    
    # Copy only package files first (better build caching)
    COPY package.json package-lock.json ./
    
    # Install dependencies
    RUN set -e; \
        if npm ci; then \
        echo "Dependencies installed successfully"; \
        else \
        echo "Warning: Fallback install with npm install"; \
        npm install; \
        fi
    
    # Copy the rest of the source code
    COPY . .
    
    # Build the React app
    RUN npm run build
    
    # ----------------------------
    # Stage 2: Runner (Serving the React App)
    # ----------------------------
    FROM nginx:alpine AS runner
    
    # WORKDIR /usr/share/nginx/html
    
    # Remove default Nginx static files
    RUN rm -rf ./*
    
    # Copy build artifacts from the builder stage
    COPY --from=builder /app/build .
    
    # Expose the correct port for serving React
    EXPOSE 80
    
    # Start Nginx
    CMD ["nginx", "-g", "daemon off;"]
    