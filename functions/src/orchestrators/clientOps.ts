// src/orchestrators/clientOps.ts
import { notificationService } from "../services/notificationService";
import { docsService } from "../services/docsService";
import { taskService } from "../services/taskService";

interface NewClientCommand {
    clientName: string;
    source: "slash_command" | "app_mention";
    slackChannel: string;
    userId: string;
}

export async function onSlackCommandNewClient(cmd: NewClientCommand) {
    // 1) Create Drive folder structure
    const folder = await docsService.createClientFolderTree(cmd.clientName);

    // 2) Create Trello card in "New Leads" (implementation hides board/list details)
    const card = await taskService.createNewClientLeadCard({
        clientName: cmd.clientName,
        driveFolderUrl: folder.url,
    });

    // 3) Notify Slack
    await notificationService.sendNewClientCreatedMessage({
        channel: cmd.slackChannel,
        clientName: cmd.clientName,
        driveFolderUrl: folder.url,
        trelloCardUrl: card.url,
    });
}
