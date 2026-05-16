FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build
EXPOSE 4000
ENV PORT=4000
CMD ["npm", "run", "start"]
