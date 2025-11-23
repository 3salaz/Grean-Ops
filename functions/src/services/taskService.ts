// src/services/taskService.ts
import { trelloClient } from "../integrations/trello/trelloClient";

const CONFIG = {
    newClientListId: process.env.TRELLO_NEW_CLIENT_LIST_ID || "",
    prListId: process.env.TRELLO_PR_LIST_ID || "",
};

export const taskService = {
    createNewClientLeadCard: async (opts: {
        clientName: string;
        driveFolderUrl: string;
    }) => {
        const card = await trelloClient.createCard({
            listId: CONFIG.newClientListId,
            name: `New client: ${opts.clientName}`,
            desc: `Drive: ${opts.driveFolderUrl}`,
        });

        return {
            id: card.id,
            url: card.url,
        };
    },

    createOrUpdatePrCard: async (opts: {
        repoFullName: string;
        title: string;
        url: string;
        author: string;
        branch: string;
    }) => {
        // For v1: just create a new card; later you can dedupe by PR URL
        const card = await trelloClient.createCard({
            listId: CONFIG.prListId,
            name: `[${opts.repoFullName}] ${opts.title}`,
            desc: `PR: ${opts.url}\nAuthor: ${opts.author}\nBranch: ${opts.branch}`,
        });

        return {
            id: card.id,
            url: card.url,
        };
    },
};
