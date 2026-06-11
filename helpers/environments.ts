// Note: baseUrl ends with "/api" — the API layer appends "/v1".
const ENV_CONFIG = {
  dev: {
    BASE_URL: "https://pre-lease-server-1.onrender.com/api",
  },
  prod: {
    BASE_URL: "https://pre-lease-server-1.onrender.com/api",
  },
};

const currentEnv: "dev" | "prod" = __DEV__ ? "dev" : "prod";

export const env = {
  BASE_URL: ENV_CONFIG[currentEnv].BASE_URL,
};

export const BASE_URL = env.BASE_URL;
