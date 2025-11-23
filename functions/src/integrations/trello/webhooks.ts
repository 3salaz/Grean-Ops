// src/integrations/trello/webhooks.ts
import { logger } from "../../common/logger";

export interface TrelloWebhookPayload {
    action: {
        type: string;
        data: any;
    };
    model: any;
}

export async function handleTrelloWebhook(payload: TrelloWebhookPayload) {
    const { action } = payload;

    switch (action.type) {
        case "updateCard":
            // Example: card moved to a different list, etc.
            logger.info("Received Trello updateCard", {
                cardId: action.data.card?.id,
                listAfter: action.data.listAfter?.name,
            });
            // Here you might call an orchestrator (e.g. engineering.onTrelloCardMoved)
            break;

        default:
            logger.info("Unhandled Trello action", { type: action.type });
    }
}
