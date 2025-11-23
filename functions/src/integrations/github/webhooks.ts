// src/integrations/github/webhooks.ts
import { onGithubPrOpened } from "../../orchestrators/engineering";
import { logger } from "../../common/logger";

export interface GithubWebhookPayload {
    action: string;
    pull_request?: {
        number: number;
        title: string;
        html_url: string;
        user: { login: string };
        head: { ref: string; repo: { name: string; owner: { login: string } } };
    };
    repository?: {
        name: string;
        owner: { login: string };
    };
}

export async function handleGithubWebhook(payload: GithubWebhookPayload) {
    if (payload.pull_request && payload.action === "opened") {
        const pr = payload.pull_request;
        const repo = pr.head.repo;

        await onGithubPrOpened({
            repoFullName: `${repo.owner.login}/${repo.name}`,
            branch: pr.head.ref,
            title: pr.title,
            url: pr.html_url,
            author: pr.user.login,
            prNumber: pr.number,
        });
    } else {
        logger.info("Unhandled GitHub webhook", {
            action: payload.action,
            hasPR: !!payload.pull_request,
        });
    }
}
