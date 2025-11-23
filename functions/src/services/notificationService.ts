// src/services/notificationService.ts
import { slackClient } from "../integrations/slack/slackClient";

export const notificationService = {
    sendNewClientCreatedMessage: async (opts: {
        channel: string;
        clientName: string;
        driveFolderUrl: string;
        trelloCardUrl: string;
    }) => {
        const text = [
            `New client created: *${opts.clientName}*`,
            `• Drive folder: ${opts.driveFolderUrl}`,
            `• Trello card: ${opts.trelloCardUrl}`,
        ].join("\n");

        await slackClient.postMessage({
            channel: opts.channel,
            text,
        });
    },

    sendPrOpenedMessage: async (opts: {
        repoFullName: string;
        title: string;
        url: string;
        author: string;
        trelloCardUrl: string;
    }) => {
        const text = [
            `New PR opened in \`${opts.repoFullName}\`:`,
            `*${opts.title}* by \`${opts.author}\``,
            opts.url,
            "",
            `Linked Trello card: ${opts.trelloCardUrl}`,
        ].join("\n");

        // TODO: map repo → channel properly
        const defaultChannel = "#eng-grean-ops";
        await slackClient.postMessage({
            channel: defaultChannel,
            text,
        });
    },
};
