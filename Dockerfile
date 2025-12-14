# --- File: akin-tunde-ccf-model/Dockerfile (Full Fixed Code) ---

# 1. Base Image: Use a Node image that has Python pre-installed or is easy to install on.
FROM node:18-bullseye-slim

# 2. Set necessary environment variables for Node and Python
ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1

# 3. Install Python Build Dependencies (needed for scikit-learn/numpy to compile)
# We use apt-get for system packages
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. Set the working directory for the application
WORKDIR /usr/src/app

# 5. Install Node Dependencies AND Dev Dependencies for the build step
# Copy package files first to leverage Docker caching
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm 
# --- FIX: Use 'pnpm install' (or just 'pnpm i') to install ALL dependencies including devDependencies (like vite) needed for the 'build' script ---
RUN pnpm install 

# 6. Install Python requirements
# Python installation should happen BEFORE the build step
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# 7. Run the build step (Vite and Esbuild)
# This step now has 'vite' available because pnpm install was run
RUN pnpm build

# 8. Clean up for a smaller final image (optional, but good practice)
# We can skip this for simplicity, but in a true production Dockerfile, you would switch to pnpm install --prod here.
# For now, keeping it simple:

# 9. Copy remaining application code (should be minimal after the build)
COPY . .

# 10. Set the port (Render's default is 10000, which Render maps to 80/443 externally)
EXPOSE 10000

# 11. Start the Node.js application using the 'start' script
# Note: 'pnpm start' uses the 'start' script in package.json
CMD ["pnpm", "start"]