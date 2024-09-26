FROM node:latest
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend .
ENV PORT=42069
EXPOSE 42069
CMD ["node", "src/server.js"]