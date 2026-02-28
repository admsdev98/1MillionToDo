FROM node:20-alpine

WORKDIR /app

COPY backend/package.json ./
RUN npm install --omit=dev

COPY backend/src ./src
COPY frontend/public ./frontend/public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
