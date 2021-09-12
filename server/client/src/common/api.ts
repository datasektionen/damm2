import { Configuration } from "./configuration";

export const url = (path: string) => `${Configuration.apiBaseUrl}${path}`;