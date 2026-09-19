FROM node:16-alpine

WORKDIR /app

# Disable server‑side rendering for Remix/React Router
ENV REACT_APP_SSR=0

COPY package.json .
RUN npm install --production

COPY . .

EXPOSE 4000
CMD ["npm", "start"]
