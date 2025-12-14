# --- File: akin-tunde-ccf-model/Dockerfile (Final Working Code) ---

# 1. Base Image: Node image that has Python pre-installed or is easy to install on.
FROM node:18-bullseye-slim

# 2. Set necessary environment variables for Node and Python
ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1

# 3. Install Python Build Dependencies (for scikit-learn/numpy compilation)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. Set the working directory
WORKDIR /usr/src/app

# 5. Prepare Node Environment
# Copy only package files first to leverage Docker caching
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm 

# --- CRITICAL FIX: Copy the patches folder before pnpm install runs ---
COPY patches/ patches/ 
# ---------------------------------------------------------------------

# --- Build Dependencies Install: Install ALL dependencies to allow the 'build' script to run ---
RUN pnpm install 

# 6. Install Python requirements
# Python installation should happen before the build step
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# 7. Copy remaining application code
COPY . .

# 8. Run the build step (Vite and Esbuild)
RUN pnpm build

# --- No cleanup step, leave node_modules as-is for runtime stability ---

# 9. Set the port (Render default)
EXPOSE 10000

# 10. Start the Node.js application 
CMD ["pnpm", "start"]