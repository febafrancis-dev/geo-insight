import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  FRONTEND_ORIGIN: z.url().default("http://127.0.0.1:5173"),
  AI_PROVIDER: z.literal("ollama").default("ollama"),
  OLLAMA_BASE_URL: z
    .url()
    .refine((value) => {
      const { hostname, protocol } = new URL(value);
      return (
        protocol === "http:" &&
        ["localhost", "127.0.0.1", "[::1]"].includes(hostname)
      );
    }, "Ollama must be hosted on the local machine")
    .default("http://127.0.0.1:11434"),
  OLLAMA_MODEL: z.string().trim().min(1).default("qwen2.5:3b"),
  OLLAMA_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  AI_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000).default(900000),
  AI_RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(10),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(`Invalid server environment: ${result.error.message}`);
}

export const env = result.data;
