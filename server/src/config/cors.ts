import cors from "cors";
import { env } from "./env";

export const corsOptions = {
  origin: env.CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);
