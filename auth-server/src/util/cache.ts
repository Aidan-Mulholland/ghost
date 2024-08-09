import NodeCache from "node-cache";
import { ACCESS_TOKEN_TTL_SECONDS } from "./constants";

export const AccessTokenCache = new NodeCache({ stdTTL: ACCESS_TOKEN_TTL_SECONDS });
