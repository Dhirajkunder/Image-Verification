
# Step 1: Use the official Node.js image
FROM node:18

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose Vite's development server port
EXPOSE 5173

# Step 7: Run the Vite development server with --host flag
CMD ["npm", "run", "dev", "--", "--host"]

