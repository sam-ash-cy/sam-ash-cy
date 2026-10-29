FROM oven/bun:1.2.20-alpine

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .

ENV PORT=3031
EXPOSE 3031

CMD ["bun", "run", "dev"]
