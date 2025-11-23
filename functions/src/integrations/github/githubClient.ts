// src/integrations/github/githubClient.ts
import fetch from "node-fetch";
import { secrets } from "../../common/secrets";

const BASE = "https://api.github.com";

async function gh(endpoint: string, init: any = {}) {
    const res = await fetch(`${BASE}${endpoint}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secrets.githubToken}`,
            "User-Agent": "grean-ops",
            ...(init.headers || {}),
        },
    });
    if (!res.ok) {
        throw new Error(
            `GitHub API error ${res.status} ${res.statusText} at ${endpoint}`
        );
    }
    return res.json();
}

export const githubClient = {
    commentOnPr: (opts: { owner: string; repo: string; prNumber: number; body: string }) =>
        gh(`/repos/${opts.owner}/${opts.repo}/issues/${opts.prNumber}/comments`, {
            method: "POST",
            body: JSON.stringify({ body: opts.body }),
        }),
};
