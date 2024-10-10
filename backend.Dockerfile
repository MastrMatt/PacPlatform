FROM node:latest
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend .
ENV PORT=42069
ENV DB_HOST=srv-captain--pacplatform-db
ENV DB_PORT=9255
EXPOSE 42069

CMD ["node", "src/server.js"]