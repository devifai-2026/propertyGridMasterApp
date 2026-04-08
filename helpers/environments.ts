// const baseUrl = "http://172.20.10.14:8000/api";
// const baseUrl = "http://localhost:3000/api";
const baseUrl = "https://pre-release-production.up.railway.app/api";
const ENV_CONFIG = {
  dev: {
    BASE_URL: baseUrl,
  },
  prod: {
    BASE_URL: baseUrl,
  },
};

const currentEnv: "dev" | "prod" = __DEV__ ? "dev" : "prod";

export const env = {
  BASE_URL: ENV_CONFIG[currentEnv].BASE_URL,
};

export const BASE_URL = env.BASE_URL;
