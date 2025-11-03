import 'dotenv/config';
import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
  url: redisUrl
});

redisClient.on("error", (err) => {
  console.error(".: Erro ao conectar ao Redis:", err);
});

(async () => {
  await redisClient.connect();
  console.log(".: Redis conectado com sucesso!");
})();

export default redisClient;
