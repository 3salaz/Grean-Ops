// src/integrations/slack/events.ts
import { onSlackCommandNewClient } from "../../orchestrators/clientOps";
import { logger } from "../../common/logger";

// Normalized representation for internal flows
export interface SlackEventEnvelope {
    type: "event_callback" | string;
    event?: {
        type: string;
        [key: string]: any;
    };
    [key: string]: any;
}

export async function handleSlackEvent(payload: SlackEventEnvelope) {
    // Example: handle `app_mention` → maybe parse command, etc.
    const event = payload.event;
    if (!event) return;

    if (event.type === "app_mention") {
        // Simple example: if user says "new client <name>"
        const text: string = event.text || "";
        const match = text.match(/new\s+client\s+(.+)/i);
        if (match) {
            const clientName = match[1].trim();
            await onSlackCommandNewClient({
                clientName,
                source: "app_mention",
                slackChannel: event.channel,
                userId: event.user,
            });
        }
    } else {
        logger.info("Unhandled Slack event type", { type: event.type });
    }
}
