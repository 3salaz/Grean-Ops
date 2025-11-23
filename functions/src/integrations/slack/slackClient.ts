// src/integrations/slack/slackClient.ts
import fetch from "node-fetch";
import { secrets } from "../../common/secrets";

const SLACK_API_BASE = "https://slack.com/api";

async function slackApi(method: string, endpoint: string, body?: any) {
    const res = await fetch(`${SLACK_API_BASE}/${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${secrets.slackBotToken}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();

    if (!json.ok) {
        throw new Error(
            `Slack API error on ${endpoint}: ${json.error || "unknown error"}`
        );
    }

    return json;
}

export const slackClient = {
    postMessage: (payload: { channel: string; text: string }) =>
        slackApi("POST", "chat.postMessage", payload),
};
