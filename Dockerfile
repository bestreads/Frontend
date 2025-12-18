# Example Dockerfile for React: https://www.docker.com/blog/how-to-dockerize-react-app/

# Build stage
FROM node:25-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json and install the dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the react app
RUN npm run build

# ---

# Production stage
FROM nginx:latest AS production

# Copy the build output from previous stage
COPY --from=build /app/dist/ /usr/share/nginx/html

# Set correct permissions for Nginx
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && find /usr/share/nginx/html -type f -exec chmod 644 {} \; \
    && find /usr/share/nginx/html -type d -exec chmod 755 {} \;

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
