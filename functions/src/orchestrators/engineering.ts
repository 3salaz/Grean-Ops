// src/orchestrators/engineering.ts
import { taskService } from "../services/taskService";
import { notificationService } from "../services/notificationService";

interface GithubPrOpenedEvent {
    repoFullName: string; // "owner/repo"
    branch: string;
    title: string;
    url: string;
    author: string;
    prNumber: number;
}

export async function onGithubPrOpened(event: GithubPrOpenedEvent) {
    // 1) Create/update Trello card
    const card = await taskService.createOrUpdatePrCard({
        repoFullName: event.repoFullName,
        title: event.title,
        url: event.url,
        author: event.author,
        branch: event.branch,
    });

    // 2) Notify Slack channel for that repo (taskService hides mapping logic)
    await notificationService.sendPrOpenedMessage({
        repoFullName: event.repoFullName,
        title: event.title,
        url: event.url,
        author: event.author,
        trelloCardUrl: card.url,
    });
}
