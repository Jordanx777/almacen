FROM node:20-slim

WORKDIR /app

# Instalar herramientas
RUN apt-get update && \
    apt-get install -y curl procps && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NG_CLI_ANALYTICS="false"

RUN npm cache clean --force && \
    npm install --legacy-peer-deps && \
    npm cache clean --force

COPY . .

EXPOSE 4200

# ✅ COMANDO CORRECTO PARA ANGULAR 19
CMD ["npx", "ng", "serve", \
     "--host", "0.0.0.0", \
     "--port", "4200", \
     "--poll", "2000"]