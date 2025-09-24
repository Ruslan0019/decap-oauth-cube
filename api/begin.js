import { createVercelBeginHandler } from "netlify-cms-oauth-provider-node";

// Хэндлер для /auth
export default createVercelBeginHandler({}, { useEnv: true });
