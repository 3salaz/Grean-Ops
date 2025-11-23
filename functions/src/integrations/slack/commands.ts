// src/integrations/slack/commands.ts
import { onSlackCommandNewClient } from "../../orchestrators/clientOps";

export interface SlackCommandPayload {
    token: string;
    team_id: string;
    team_domain: string;
    channel_id: string;
    channel_name: string;
    user_id: string;
    user_name: string;
    command: string;
    text: string;
    response_url: string;
    trigger_id: string;
}

export async function handleSlackCommand(payload: SlackCommandPayload) {
    const { command, text, channel_id, user_id } = payload;

    if (command === "/new-client") {
        const clientName = text.trim();
        if (!clientName) {
            return {
                response_type: "ephemeral",
                text: "Usage: /new-client <Client Name>",
            };
        }

        await onSlackCommandNewClient({
            clientName,
            source: "slash_command",
            slackChannel: channel_id,
            userId: user_id,
        });

        return {
            response_type: "ephemeral",
            text: `Got it. Spinning up Grean artifacts for *${clientName}*...`,
        };
    }

    return {
        response_type: "ephemeral",
        text: `Unknown command: ${command}`,
    };
}
