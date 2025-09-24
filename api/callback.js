import { createVercelCompleteHandler } from "netlify-cms-oauth-provider-node";

// Хэндлер для /callback
export default createVercelCompleteHandler({}, { useEnv: true });
