FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=42069
EXPOSE 42069
CMD ["node", "src/server.js"]