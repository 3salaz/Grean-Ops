// src/common/logger.ts
import * as functions from "firebase-functions";

export const logger = {
    info: (msg: string, meta?: unknown) =>
        functions.logger.info(msg, meta ?? {}),
    warn: (msg: string, meta?: unknown) =>
        functions.logger.warn(msg, meta ?? {}),
    error: (msg: string, meta?: unknown) =>
        functions.logger.error(msg, meta ?? {}),
};
