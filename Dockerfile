# Verwende das offizielle Node.js  LTS (Long Term Support) Image als Basis
FROM node:22-alpine

# Setze das Arbeitsverzeichnis innerhalb des Containers
WORKDIR /app

# Installiere die Abhängigkeiten der Anwendung
COPY package.json package-lock.json ./
RUN npm install --production

# Installiere NestJS CLI global, falls benötigt
RUN npm install -g @nestjs/cli

# Kopiere den Rest des Codes in das Arbeitsverzeichnis
COPY . .

# Baue die Anwendung
RUN npm run build

# Öffne den Port, auf dem die Anwendung läuft
EXPOSE 3000

# Starte die Anwendung
CMD ["npm", "run", "start:prod"]