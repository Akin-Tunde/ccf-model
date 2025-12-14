# --- Dockerfile ---
# Start with a base image that has Python and Node
FROM node:18-bullseye-slim

# Install Python and dependencies
RUN apt-get update && apt-get install -y python3 python3-pip python3-dev build-essential

# Set the working directory
WORKDIR /usr/src/app

# Install Python requirements
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copy all application files
COPY . .

# Install Node dependencies and build the app
RUN npm install -g pnpm 
RUN pnpm install --prod
RUN pnpm build

# Expose port and set the command to run the built application
EXPOSE 10000
CMD ["pnpm", "start"] 
# Note: 'pnpm start' uses the 'start' script, which needs to be cross-env enabled.